#!/usr/bin/env python3
"""
MCP Client for GitLab CI - HTTP transport version
Connects to Serena and Context7 MCP servers via HTTP
"""
import json
import requests
from typing import Dict, List, Optional
from dataclasses import dataclass


@dataclass
class SymbolInfo:
    """シンボル情報"""
    name: str
    file: str
    line: int
    kind: str  # function, class, interface, type, etc.
    signature: Optional[str] = None


@dataclass
class Reference:
    """参照箇所情報"""
    file: str
    line: int
    column: int
    context: str  # 周辺コード


class MCPHTTPClient:
    """MCP HTTP クライアント（JSON-RPC over HTTP）"""

    def __init__(self, base_url: str, timeout: int = 30):
        self.base_url = base_url.rstrip('/')
        self.timeout = timeout
        self._request_id = 0

    def call_tool(self, tool_name: str, arguments: Dict) -> Dict:
        """MCP ツール呼び出し（HTTP POST）"""
        self._request_id += 1
        request_payload = {
            "jsonrpc": "2.0",
            "id": self._request_id,
            "method": "tools/call",
            "params": {
                "name": tool_name,
                "arguments": arguments
            }
        }

        try:
            response = requests.post(
                f"{self.base_url}/mcp",
                json=request_payload,
                timeout=self.timeout,
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"⚠️  MCP HTTP request failed for {tool_name}: {e}")
            return {"error": str(e)}

    def close(self):
        """クライアント終了（HTTP なので何もしない）"""
        pass


class SerenaClient:
    """Serena MCP Client - コードシンボル解析（HTTP版）"""

    def __init__(self, base_url: str, workspace_path: str):
        self.workspace_path = workspace_path
        self.client = MCPHTTPClient(base_url)
        print(f"✅ Serena HTTP client initialized: {base_url}")

    def get_definition(self, file_path: str, symbol_name: str) -> Optional[SymbolInfo]:
        """シンボルの定義箇所を取得"""
        try:
            result = self.client.call_tool("find_declaration", {
                "uri": f"file://{self.workspace_path}/{file_path}",
                "symbol": symbol_name
            })

            if result.get("error"):
                return None

            content = result.get("content", [{}])[0]
            return SymbolInfo(
                name=symbol_name,
                file=content.get("file", ""),
                line=content.get("line", 0),
                kind=content.get("kind", ""),
                signature=content.get("signature")
            )
        except Exception as e:
            print(f"⚠️  get_definition error for {symbol_name}: {e}")
            return None

    def get_references(self, file_path: str, symbol_name: str) -> List[Reference]:
        """シンボルの参照箇所を取得"""
        try:
            result = self.client.call_tool("find_referencing_symbols", {
                "uri": f"file://{self.workspace_path}/{file_path}",
                "symbol": symbol_name
            })

            references = []
            for ref in result.get("content", []):
                references.append(Reference(
                    file=ref.get("file", ""),
                    line=ref.get("line", 0),
                    column=ref.get("column", 0),
                    context=ref.get("context", "")
                ))
            return references
        except Exception as e:
            print(f"⚠️  get_references error for {symbol_name}: {e}")
            return []

    def get_file_symbols(self, file_path: str) -> List[SymbolInfo]:
        """ファイル内の全シンボルを取得"""
        try:
            result = self.client.call_tool("get_symbols_overview", {
                "uri": f"file://{self.workspace_path}/{file_path}"
            })

            symbols = []
            for sym in result.get("content", []):
                symbols.append(SymbolInfo(
                    name=sym.get("name", ""),
                    file=file_path,
                    line=sym.get("line", 0),
                    kind=sym.get("kind", ""),
                    signature=sym.get("signature")
                ))
            return symbols
        except Exception as e:
            print(f"⚠️  get_file_symbols error for {file_path}: {e}")
            return []

    def get_type_info(self, file_path: str, symbol_name: str) -> Optional[Dict]:
        """型情報を取得"""
        try:
            result = self.client.call_tool("hover", {
                "uri": f"file://{self.workspace_path}/{file_path}",
                "symbol": symbol_name
            })

            if result.get("error"):
                return None

            return result.get("content", [{}])[0]
        except Exception as e:
            print(f"⚠️  get_type_info error for {symbol_name}: {e}")
            return None

    def close(self):
        """Serena クライアント終了"""
        self.client.close()


class Context7Client:
    """Context7 MCP Client - ドキュメント検索（静的版）"""

    # NOTE: Context7 は HTTP transport をサポートしていないため、静的知識を使用
    TECH_STACK_DOCS = {
        "react": """
React 19 Best Practices:
- Server Components をデフォルトとし、状態が必要な場合のみ 'use client' を使用
- Client Component は可能な限り葉ノードに配置（ツリーの深い位置）
- async/await を Server Components で活用してデータフェッチを簡潔に記述
- useEffect の依存配列を正確に管理し、無限ループを防ぐ
- カスタムフックで状態ロジックを再利用可能にする
""",
        "next.js": """
Next.js 15 App Router Best Practices:
- app/ ディレクトリ構造: layout.tsx は共通UI、page.tsx は各ルート
- Server Actions: フォーム送信や mutation は Server Actions で実装
- redirect() は try-catch ブロックの外で実行する（内部的に例外を投げるため）
- Metadata API を使って SEO 対策を実施
- 動的ルーティング: [slug] フォルダで動的パスを実装
- キャッシュ戦略: fetch() の cache オプションで制御
""",
        "zustand": """
Zustand Best Practices:
- イミュータブルな更新パターン: set((state) => ({ ...state, newField: value }))
- TypeScript 型定義を徹底し、any 型の使用を避ける
- devtools() ミドルウェアで状態変更を可視化
- persist() ミドルウェアで localStorage 永続化
- ストアの分割: 関心ごとに複数のストアを作成して依存を減らす
- 非同期処理は async 関数をストア内に定義
""",
        "typescript": """
TypeScript Best Practices:
- strict モード有効化（tsconfig.json で "strict": true）
- any 型の使用禁止 → unknown + 型ガードで対応
- 関数シグネチャに明示的な戻り値型を記述
- ユーティリティ型を活用（Partial, Pick, Omit, Record など）
- discriminated union で型安全な分岐処理
- 型アサーション（as）は最小限に抑える
"""
    }

    def __init__(self):
        print("⚠️  Context7: 静的知識モード（HTTP transport 未サポート）")

    def get_library_docs(self, library: str, query: str) -> str:
        """ライブラリドキュメントを検索（静的知識から返す）"""
        return self.TECH_STACK_DOCS.get(library, f"[{library} のドキュメント情報なし]")

    def close(self):
        """Context7 クライアント終了（何もしない）"""
        pass
