#!/usr/bin/env python3
"""
GitLab MR AI レビュースクリプト (Serena & Context7統合版)
AWS Bedrock Claude + Serena MCP + Context7 MCP でコードレビューを実行
"""
import os
import json
import subprocess
import boto3
import requests
from typing import Dict, List

try:
    from mcp_client import SerenaClient, Context7Client
    MCP_AVAILABLE = True
    print("✅ MCP Client loaded (simplified mode)")
except ImportError as e:
    print(f"⚠️  MCP Client not available: {e}, running in basic mode")
    MCP_AVAILABLE = False


# 環境変数
GITLAB_API_URL = os.getenv("CI_API_V4_URL")
PROJECT_ID = os.getenv("CI_PROJECT_ID")
MR_IID = os.getenv("CI_MERGE_REQUEST_IID")
GITLAB_TOKEN = os.getenv("GITLAB_REVIEWER_TOKEN")
AWS_REGION = os.getenv("AWS_REGION") or os.getenv("AWS_DEFAULT_REGION", "ap-northeast-1")
BEDROCK_MODEL_ID = os.getenv("BEDROCK_MODEL")
WORKSPACE_PATH = os.getenv("WORKSPACE_PATH", "/builds/harz/harz")
LOG_DIR = os.getenv("LOG_DIR", ".claude/logs/cicd")
SERENA_URL = os.getenv("SERENA_URL", "http://127.0.0.1:8000")

# Bedrock Model ID必須チェック
if not BEDROCK_MODEL_ID:
    raise ValueError("BEDROCK_MODEL 環境変数が設定されていません。inference profile ARN を設定してください。")


def get_git_diff() -> str:
    """git diff コマンドで変更を取得"""
    base_sha = os.getenv("CI_MERGE_REQUEST_DIFF_BASE_SHA")
    head_sha = os.getenv("CI_COMMIT_SHA")

    if not base_sha or not head_sha:
        print("⚠️  git diff用のSHAが取得できません。GitLab APIにフォールバック")
        return None

    result = subprocess.run(
        ["git", "diff", f"{base_sha}..{head_sha}", "--", "."],
        capture_output=True,
        text=True,
        cwd=WORKSPACE_PATH
    )

    if result.returncode != 0:
        print(f"❌ git diff failed: {result.stderr}")
        return None

    print(f"✅ git diff取得成功（{len(result.stdout)} bytes）")
    return result.stdout


def get_changed_files() -> List[str]:
    """変更されたファイル一覧を取得"""
    base_sha = os.getenv("CI_MERGE_REQUEST_DIFF_BASE_SHA")
    head_sha = os.getenv("CI_COMMIT_SHA")

    if not base_sha or not head_sha:
        return []

    result = subprocess.run(
        ["git", "diff", "--name-only", f"{base_sha}..{head_sha}"],
        capture_output=True,
        text=True,
        cwd=WORKSPACE_PATH
    )

    return [f for f in result.stdout.strip().split("\n") if f]


def analyze_with_serena(changed_files: List[str], serena) -> str:
    """Serenaでコードを分析"""
    if not MCP_AVAILABLE or not serena:
        return ""

    analysis = "## コードシンボル分析（簡易版）\n\n"

    for file_path in changed_files[:100]:  # 最初の100ファイル
        if not file_path.endswith((".ts", ".tsx")):
            continue

        analysis += f"### {file_path}\n\n"

        # ファイル内の全シンボル
        try:
            symbols = serena.get_file_symbols(file_path)
            if symbols:
                analysis += "**定義されているシンボル:**\n"
                for sym in symbols[:30]:  # 最初の30個
                    analysis += f"- {sym.kind} `{sym.name}` (L{sym.line})\n"
            else:
                analysis += "（シンボル情報なし）\n"
        except Exception as e:
            analysis += f"⚠️  分析エラー: {e}\n"

        analysis += "\n"

    return analysis


def get_context7_docs(context7) -> str:
    """Context7で技術スタック情報を取得"""
    if not MCP_AVAILABLE:
        return ""

    docs = "## 技術スタック ベストプラクティス\n\n"

    tech_stack = {
        "react": "Server Component vs Client Component, hooks rules",
        "next.js": "App Router patterns, Server Actions",
        "zustand": "state management, immutability",
        "typescript": "type safety, strict mode"
    }

    for lib, query in tech_stack.items():
        try:
            lib_docs = context7.get_library_docs(lib, query)
            docs += f"### {lib}\n{lib_docs}\n\n"
        except Exception as e:
            docs += f"### {lib}\n[取得エラー: {e}]\n\n"

    return docs


def review_with_bedrock_claude(diff: str, serena_analysis: str, context7_docs: str, mr_data: Dict) -> str:
    """AWS Bedrock Claude でレビュー実行"""
    import botocore.config
    config = botocore.config.Config(
        read_timeout=180,  # 3分に延長
        connect_timeout=10
    )
    client = boto3.client('bedrock-runtime', region_name=AWS_REGION, config=config)

    system_prompt = f"""あなたは経験豊富なコードレビュアーです。

このプロジェクトの技術スタック:
- フロントエンド: Next.js 15 (App Router), React 19, TypeScript
- 状態管理: Zustand
- BFF: Next.js API Routes
- バックエンド: C# (.NET)

{context7_docs}

{serena_analysis}

レビュー観点:
1. 🔴 重大（致命的バグ・セキュリティリスク）
2. 🟡 警告（バグの可能性・パフォーマンス問題）
3. 🟢 提案（コード品質向上・可読性改善）
4. 🔵 確認（意図確認・設計質問）


特に注目:
- Server/Client Component 境界（'use client'の適切な配置）
- Zustand ストアの不変性・型安全性
- TypeScript型安全性（any型の禁止）
- 他ファイルへの影響（Serena参照情報を活用）
- BFF層でのViewModel整形（FHIRリソース直返し禁止）

出力フォーマット:
- ファイルパスと行番号を明記
- 具体的な改善案を提示
- 全体サマリーを最後に記載
"""

    # diff サイズを制限（30KB まで）
    diff_limited = diff[:30000] if len(diff) > 30000 else diff
    if len(diff) > 30000:
        diff_limited += f"\n\n... (残り {len(diff) - 30000} bytes は省略されました)"

    user_prompt = f"""以下の MR をレビューしてください。

**MR #{MR_IID}**: {mr_data.get('title', '')}
**説明**: {mr_data.get('description', 'なし')}

**変更内容 (git diff)**:
```diff
{diff_limited}
```
"""

    request_body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 8000,
        "system": system_prompt,
        "messages": [{"role": "user", "content": user_prompt}]
    }

    response = client.invoke_model(
        modelId=BEDROCK_MODEL_ID,
        body=json.dumps(request_body)
    )

    response_body = json.loads(response['body'].read())
    return response_body['content'][0]['text']


def post_review_comment(review_text: str, mcp_enabled: bool):
    """レビュー結果を MR にコメント"""
    mcp_status = "Serena MCP (HTTP) + Context7" if mcp_enabled else "Basic Mode"
    comment_body = f"""## 🤖 AI Code Review ({mcp_status})

{review_text}

---
*Powered by AWS Bedrock Claude (Sonnet 4.6){' + Serena MCP (HTTP transport)' if mcp_enabled else ''}*
"""
    requests.post(
        f"{GITLAB_API_URL}/projects/{PROJECT_ID}/merge_requests/{MR_IID}/notes",
        headers={"PRIVATE-TOKEN": GITLAB_TOKEN, "Content-Type": "application/json"},
        json={"body": comment_body}
    ).raise_for_status()


def main():
    print("🚀 AI レビューを開始（Serena & Context7統合版）...")
    print(f"🔍 デバッグ: BEDROCK_MODEL={BEDROCK_MODEL_ID}")
    print(f"🔍 デバッグ: AWS_REGION={AWS_REGION}")
    print(f"🔍 デバッグ: WORKSPACE_PATH={WORKSPACE_PATH}")
    print(f"🔍 デバッグ: MCP_AVAILABLE={MCP_AVAILABLE}")

    # 環境変数チェック
    required_vars = {
        "CI_API_V4_URL": GITLAB_API_URL,
        "CI_PROJECT_ID": PROJECT_ID,
        "CI_MERGE_REQUEST_IID": MR_IID,
        "GITLAB_REVIEWER_TOKEN": GITLAB_TOKEN,
        "AWS_REGION": AWS_REGION,
        "BEDROCK_MODEL": BEDROCK_MODEL_ID
    }

    missing_vars = [name for name, value in required_vars.items() if not value]
    if missing_vars:
        print(f"❌ エラー: 以下の環境変数が設定されていません: {', '.join(missing_vars)}")
        exit(1)

    # MCP Clients初期化
    serena = None
    context7 = None

    try:
        if MCP_AVAILABLE:
            print("📡 MCPクライアント初期化中...")
            serena = SerenaClient(SERENA_URL, WORKSPACE_PATH)
            context7 = Context7Client()
            print("✅ MCPクライアント初期化完了")

        # git diff取得
        print("📝 git diffを取得中...")
        diff = get_git_diff()
        if not diff:
            print("❌ git diff取得失敗")
            exit(1)

        # 変更ファイル一覧
        changed_files = get_changed_files()
        print(f"📊 変更ファイル数: {len(changed_files)}")

        # Serena分析
        serena_analysis = ""
        if MCP_AVAILABLE and serena:
            print("🔍 Serenaでコード分析中...")
            serena_analysis = analyze_with_serena(changed_files, serena)

        # Context7ドキュメント取得
        context7_docs = ""
        if MCP_AVAILABLE and context7:
            print("📚 Context7でドキュメント取得中...")
            context7_docs = get_context7_docs(context7)

        # GitLab MR情報取得
        mr_data = requests.get(
            f"{GITLAB_API_URL}/projects/{PROJECT_ID}/merge_requests/{MR_IID}",
            headers={"PRIVATE-TOKEN": GITLAB_TOKEN}
        ).json()

        # Bedrock Claudeレビュー
        print("🤖 Bedrockでレビュー実行中...")
        review_result = review_with_bedrock_claude(diff, serena_analysis, context7_docs, mr_data)
        print("✅ レビュー完了")

        # MRにコメント投稿
        print("💬 コメント投稿中...")
        post_review_comment(review_result, MCP_AVAILABLE and serena is not None)
        print("✅ コメント投稿完了")

    except Exception as e:
        print(f"❌ エラー発生: {e}")
        import traceback
        traceback.print_exc()
        exit(1)

    finally:
        # MCPクライアント終了
        if serena:
            serena.close()
        if context7:
            context7.close()


if __name__ == "__main__":
    main()
