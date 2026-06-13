#!/usr/bin/env node

/**
 * implement キーワード検出フック
 *
 * トリガー: 任意のコマンド（/ralph, /omc 等）の本文に "implement" が含まれるとき
 *
 * 動作:
 *   プロンプト本文から "implement" ワードを検出し、
 *   .claude/commands/implement.md のワークフロー実行指示をプロンプトに注入する。
 *   スクリーンコード（例: REC001）が含まれる場合は reference.md から要件ファイルも解決する。
 *
 * 除外:
 *   - プロンプトが "/implement " で始まる場合（コマンド直接呼び出しはスキップ）
 *   - "implement" が含まれない場合
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const PROJECT_ROOT   = path.resolve(__dirname, '../../');
const REFERENCE_MD   = path.resolve(__dirname, 'reference.md');
const IMPLEMENT_CMD  = path.resolve(__dirname, '../commands/implement.md');

// ─── stdin ────────────────────────────────────────────────────────────────────
async function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.on('data', (c) => { data += c; });
    process.stdin.on('end',  () => { resolve(data); });
  });
}

// ─── スクリーンコード抽出 ──────────────────────────────────────────────────────
function extractCode(prompt) {
  const m = prompt.match(/\b([A-Z]{2,}[0-9]{3,})\b/);
  return m ? m[1] : null;
}

// ─── reference.md から要件ファイルを解決 ──────────────────────────────────────
function resolveRequirements(code) {
  if (!code || !fs.existsSync(REFERENCE_MD)) return [];

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

// ─── implement.md の存在確認 ──────────────────────────────────────────────────
function getImplementCmdPath() {
  if (fs.existsSync(IMPLEMENT_CMD)) return '.claude/commands/implement.md';
  return null;
}

// ─── メイン ───────────────────────────────────────────────────────────────────
async function main() {
  let raw = '';
  try {
    raw = await readStdin();
    const input   = JSON.parse(raw);
    const prompt  = input.prompt || input.content || input.message || '';
    const trimmed = prompt.trim();

    // /implement コマンド直接呼び出しはスキップ（二重注入を防ぐ）
    if (trimmed.startsWith('/implement ') || trimmed === '/implement') {
      process.stdout.write(raw);
      process.exit(0);
    }

    // "implement" ワードが本文にない場合はスキップ
    if (!/\bimplement\b/i.test(trimmed)) {
      process.stdout.write(raw);
      process.exit(0);
    }

    const code         = extractCode(trimmed);
    const requirements = resolveRequirements(code);
    const cmdPath      = getImplementCmdPath();

    const requirementsSection = requirements.length > 0
      ? `\n**要件ファイル（reference.md から解決）:**\n${requirements.map(f => `- ${f}`).join('\n')}\n`
      : code
        ? `\n⚠️ スクリーンコード "${code}" は reference.md 未登録です。要件ファイルは手動で確認してください。\n`
        : '';

    const injection = `

---
🔧 **[implement-trigger] "implement" キーワード検出**
コマンド定義: \`${cmdPath || '（implement.md が見つかりません）'}\`
${code ? `対象コード: **${code}**` : '対象コード: （未検出 — プロンプトから読み取ってください）'}
${requirementsSection}
## 実行指示

以下の手順で実装フェーズを開始してください:

1. \`${cmdPath || '.claude/commands/implement.md'}\` を **Read** で読み込み、ワークフローを確認する
2. \`CLAUDE.md\` を読み、session_phase を確認する
3. ${code ? `"${code}" に対応する \`.steering/\` 配下の state.md を確認する` : 'ユーザーの意図する機能の .steering/ state.md を確認する'}
4. implement.md のステップに従い、**サブエージェントを並列起動**して実装を進める

**自己判断でファイルを検索したり、指示外の作業を開始してはいけません。**
---
`;

    process.stdout.write(JSON.stringify({ ...input, prompt: prompt + injection }));
    process.exit(0);

  } catch (error) {
    process.stderr.write(`[implement-trigger] Error: ${error.message}\n`);
    process.stdout.write(raw || '{}');
    process.exit(0);
  }
}

main();
