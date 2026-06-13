#!/usr/bin/env node

/**
 * サーバーテストフック
 *
 * トリガー: ユーザーが「サーバーテスト」を含むプロンプトを入力したとき
 *
 * 動作:
 *   プロンプトから画面コード（例: REC002）を抽出し、
 *   LV3/test/{CODE}-test.js が存在する場合は server-test.sh の実行指示のみ注入する。
 *   存在しない場合は Playwright エージェントを使ったテスト自動生成ワークフローを注入する。
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT  = path.resolve(__dirname, '../../');
const REFERENCE_MD  = path.resolve(__dirname, 'reference.md');

async function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.on('data', (c) => { data += c; });
    process.stdin.on('end',  () => { resolve(data); });
  });
}

function extractCode(prompt) {
  const m = prompt.match(/\b([A-Z]{2,}[0-9]{3,})\b/);
  return m ? m[1] : null;
}

function parseReferenceRequirements(code) {
  if (!fs.existsSync(REFERENCE_MD)) return [];

  const text = fs.readFileSync(REFERENCE_MD, 'utf8');
  const sectionRegex = new RegExp(`^## ${code}\\s*$`, 'm');
  const sectionMatch = text.match(sectionRegex);
  if (!sectionMatch) return [];

  const sectionStart = sectionMatch.index + sectionMatch[0].length;
  const nextSection  = text.indexOf('\n## ', sectionStart);
  const sectionBody  = nextSection === -1 ? text.slice(sectionStart) : text.slice(sectionStart, nextSection);

  const yamlMatch = sectionBody.match(/```yaml\n([\s\S]*?)```/);
  if (!yamlMatch) return [];

  const requirements = [];
  let inReq = false;
  for (const line of yamlMatch[1].split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('requirements:')) { inReq = true; continue; }
    if (inReq && trimmed.startsWith('-')) {
      requirements.push(trimmed.replace(/^-\s*/, '').trim());
    } else if (inReq && trimmed && !trimmed.startsWith('-') && !trimmed.startsWith('#')) {
      inReq = false;
    }
  }
  return requirements;
}

/**
 * LV3/test/{CODE}-test.js の存在を確認する。
 * 存在する場合はそのパスを返す。存在しない場合は null を返す。
 */
function findTestFile(code) {
  try {
    const result = execSync(
      `find product/frontend/src/features -path "*/test/${code}-test.js" -type f 2>/dev/null`,
      { cwd: PROJECT_ROOT, timeout: 5000 }
    ).toString().trim();
    return result.length > 0 ? result.split('\n')[0] : null;
  } catch (_) {
    return null;
  }
}

/**
 * {CODE}.tsx を探してその親ディレクトリ配下の test/ フォルダパスを返す。
 * 見つからない場合は null を返す。
 */
function findLV3TestDir(code) {
  try {
    const result = execSync(
      `find product/frontend/src/features -name "${code}.tsx" -not -path "*/node_modules/*" 2>/dev/null`,
      { cwd: PROJECT_ROOT, timeout: 5000 }
    ).toString().trim();
    if (result.length === 0) return null;
    const mainFile = result.split('\n')[0];
    return path.join(path.dirname(mainFile), 'test');
  } catch (_) {
    return null;
  }
}

async function main() {
  let raw = '';
  try {
    raw = await readStdin();
    const input  = JSON.parse(raw);
    const prompt = input.prompt || input.content || input.message || '';

    if (!prompt.includes('サーバーテスト')) {
      process.stdout.write(raw);
      process.exit(0);
    }

    const code         = extractCode(prompt);
    const requirements = code ? parseReferenceRequirements(code) : [];
    const testFilePath = code ? findTestFile(code) : null;

    const codeSection = code
      ? `\n- 対象コード: **${code}**\n- 要件ファイル:\n${requirements.map(r => `  - \`${r}\``).join('\n') || '  - （登録なし）'}`
      : '';

    let instruction;

    if (testFilePath) {
      // テストファイルが既存 → server-test.sh 実行のみ
      instruction = `
---
[サーバーテスト指示]

テストファイルが既に存在します: \`${testFilePath}\`
Playwright エージェントの起動は不要です。

以下の手順でサーバーテストを実行してください。

1. 次のコマンドを実行してテスト結果を確認する:
   \`\`\`bash
   bash .claude/scripts/server-test.sh${code ? ` ${code}` : ''}
   \`\`\`
${codeSection}

2. スクリプトが出力するサマリー（✓ N/M passed）を確認する
3. ログファイルを \`gitlab-runner/logs/\` から読んでエラー内容を報告する
4. 失敗したテストがあれば原因を分析して修正提案を行う

---
`;
    } else {
      // テストファイルが未存在 → Playwright エージェントを使ってテストを自動生成する
      const codeArg     = code || '{CODE}';
      const docsGlob    = `docs/01_アプリ/**/${codeArg}*`;
      const lv3TestDir  = code ? findLV3TestDir(code) : null;
      const seedFile    = lv3TestDir
        ? path.join(lv3TestDir, `${codeArg}.seed.spec.ts`)
        : `product/frontend/src/features/{LV1}/{LV2}/{LV3}/test/${codeArg}.seed.spec.ts`;

      instruction = `
---
[サーバーテスト指示 — テストファイル未作成]

\`product/frontend/src/features/**/test/${codeArg}-test.js\` が存在しません。
以下の手順でテストを自動生成してから実行してください。

## ステップ 1: PRD・設計書を読む

\`\`\`bash
find docs/01_アプリ -name "*.md" | xargs grep -l "${codeArg}" 2>/dev/null | head -5
\`\`\`

見つかったファイルを Read して受入条件・操作イベント定義・エラー表示設計を把握する。

## ステップ 2: 実装済みファイルを確認する

\`\`\`bash
find product/frontend/src/features -path "*${codeArg}*" -o -path "*${codeArg.toLowerCase()}*" 2>/dev/null | grep -v node_modules | sort
\`\`\`

コンポーネント構成（organisms / molecules）と主要な UI 要素を把握する。

## ステップ 3: シードファイルを作成する

\`${seedFile}\` を以下の内容で作成する（存在しない場合のみ）:

\`\`\`typescript
import { test, expect } from '@playwright/test';

test.describe('${codeArg}', () => {
  test('seed', async ({ page }) => {
    // generate code here.
  });
});
\`\`\`

## ステップ 4: Playwright エージェントでテストを生成する

以下の順序でエージェントを起動する（シードファイルと URL を渡す）:

1. **playwright-test-planner** を起動してテスト計画を作成する
   - シードファイル: \`${seedFile}\`
   - localhost:3000 に Next.js 開発サーバーが起動していることを前提とする
   - PRD の受入条件・操作イベント定義をもとにシナリオを設計する

2. **playwright-test-generator** を起動して Playwright テストコードを生成する
   - planner の出力したテスト計画を使用する
   - 生成先: \`product/frontend/src/features/**/test/${codeArg}-test.js\`

3. **playwright-test-healer** を起動して失敗テストを修正する（最大 3 回繰り返し）
   - テストがすべて PASS になるまでループする
   - 修正不能な場合は \`test.fixme()\` でマークして理由をコメントに記載する

## ステップ 5: server-test.sh を実行する

テスト生成完了後にサーバーテストを実行する:

\`\`\`bash
bash .claude/scripts/server-test.sh${code ? ` ${code}` : ''}
\`\`\`
${codeSection}

6. スクリプトが出力するサマリー（✓ N/M passed）を確認する
7. ログファイルを \`gitlab-runner/logs/\` から読んでエラー内容を報告する
8. 失敗したテストがあれば原因を分析して修正提案を行う

---
`;
    }

    const newPrompt = prompt + '\n\n' + instruction;
    process.stdout.write(JSON.stringify({ ...input, prompt: newPrompt }));
    process.exit(0);

  } catch (error) {
    process.stderr.write(`[server-test-trigger] Error: ${error.message}\n`);
    process.stdout.write(raw || '{}');
    process.exit(0);
  }
}

main();
