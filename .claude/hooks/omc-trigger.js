#!/usr/bin/env node

/**
 * /omc-teams 3 コマンド検出フック
 *
 * トリガー: ユーザーが "/omc-teams 3" を入力
 *
 * 動作:
 *   引数からスクリーンコードと操作名を抽出し、
 *   .claude/hooks/reference.md を参照して
 *   要件ファイル群・ゲート群・構成参考・エージェント・スキルを自動解決してプロンプトに注入する。
 *
 * エージェント選択（操作名）:
 *   入力の「{コード} の {操作名}」または「{コード}{の}{操作名}」の形式で操作名を抽出する。
 *   例:
 *     "RES002のフロント実装" → 操作名: "フロント実装" → エージェント: フロント実装
 *     "REC001 のフロントテスト" → 操作名: "フロントテスト" → エージェント: フロントテスト
 *     "RES001 確認" → 操作名: なし → default_agent を使用
 *
 * エージェント・スキル定義: .claude/hooks/reference.md の「グローバル定義」セクション参照
 * コードが見つからない場合: 作業を止めてユーザーに reference.md への登録を促す。
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '../../');
const REFERENCE_MD = path.resolve(__dirname, 'reference.md');

// ─── stdin ────────────────────────────────────────────────────────────────────
async function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.on('data', (c) => { data += c; });
    process.stdin.on('end',  () => { resolve(data); });
  });
}

// ─── グローバル定義パーサー ───────────────────────────────────────────────────
/**
 * reference.md の「グローバル定義」セクションからエージェント・スキル定義テーブルを解析する。
 * 返り値: {
 *   agents: { 'フロント実装': '.claude/agents/...', ... },
 *   skills: { 'フロント詳細設計': '.claude/skills/...', ... }
 * }
 */
function parseGlobalDefinitions(text) {
  const defs = { agents: {}, skills: {} };

  const globalSectionMatch = text.match(/^## グローバル定義\s*$([\s\S]*?)^---/m);
  if (!globalSectionMatch) return defs;

  const globalText = globalSectionMatch[1];

  // エージェント定義テーブル
  const agentSectionMatch = globalText.match(/### エージェント定義\s*\n([\s\S]*?)(?=###|$)/);
  if (agentSectionMatch) {
    for (const line of agentSectionMatch[1].split('\n')) {
      const cols = line.split('|').map(s => s.trim()).filter(Boolean);
      if (cols.length >= 2 && !cols[0].startsWith('名前') && !cols[0].startsWith('---') && !cols[0].startsWith('>')) {
        defs.agents[cols[0]] = cols[1];
      }
    }
  }

  // スキル定義テーブル
  const skillSectionMatch = globalText.match(/### スキル定義\s*\n([\s\S]*?)(?=###|$)/);
  if (skillSectionMatch) {
    for (const line of skillSectionMatch[1].split('\n')) {
      const cols = line.split('|').map(s => s.trim()).filter(Boolean);
      if (cols.length >= 2 && !cols[0].startsWith('名前') && !cols[0].startsWith('---') && !cols[0].startsWith('>')) {
        defs.skills[cols[0]] = cols[1];
      }
    }
  }

  return defs;
}

// ─── reference.md パーサー ────────────────────────────────────────────────────
/**
 * reference.md から全エントリを解析して返す。
 * 返り値: {
 *   _global: { agents: {...}, skills: {...} },
 *   RES002: { requirements: [...], gates: [...], structure: '...', agents: [...], skills: [...], default_agent: '...' },
 *   ...
 * }
 */
function parseReference() {
  if (!fs.existsSync(REFERENCE_MD)) return {};

  const text = fs.readFileSync(REFERENCE_MD, 'utf8');
  const result = {};

  // グローバル定義を解析
  result._global = parseGlobalDefinitions(text);

  // コードエントリを解析
  const sectionRegex = /^##\s+([A-Z]{2,}[0-9]{3,})\s*$/gm;
  let match;

  while ((match = sectionRegex.exec(text)) !== null) {
    const code         = match[1];
    const sectionStart = match.index + match[0].length;
    const nextSection  = text.indexOf('\n## ', sectionStart);
    const sectionBody  = nextSection === -1
      ? text.slice(sectionStart)
      : text.slice(sectionStart, nextSection);

    const yamlMatch = sectionBody.match(/```yaml\n([\s\S]*?)```/);
    if (!yamlMatch) continue;

    result[code] = parseYamlEntry(yamlMatch[1]);
  }

  return result;
}

/**
 * コードエントリの YAML を解析する。
 * 新フォーマット (agents: リスト, skills: リスト) と
 * 旧フォーマット (agents: マップ, agent: 単一) を両方サポート。
 */
function parseYamlEntry(text) {
  const result = {
    requirements: [],
    gates: [],
    structure: '',
    agents: [],       // 名前リスト（グローバル定義のキー）
    skills: [],       // 名前リスト（グローバル定義のキー）
    default_agent: '',
    // 旧フォーマット後方互換
    _legacyAgentsMap: {},
  };

  let context = null;

  for (const rawLine of text.split('\n')) {
    const line    = rawLine.trimEnd();
    const trimmed = line.trimStart();

    if (trimmed.startsWith('requirements:')) { context = 'requirements'; continue; }
    if (trimmed.startsWith('gates:'))        { context = 'gates';        continue; }
    if (trimmed.startsWith('agents:'))       { context = 'agents';       continue; }
    if (trimmed.startsWith('skills:'))       { context = 'skills';       continue; }

    if (trimmed.startsWith('structure:')) {
      context = null;
      result.structure = trimmed.replace(/^structure:\s*/, '').trim();
      continue;
    }
    if (trimmed.startsWith('default_agent:')) {
      context = null;
      result.default_agent = trimmed.replace(/^default_agent:\s*/, '').trim();
      continue;
    }
    // 旧フォーマット後方互換
    if (trimmed.startsWith('gate:')) {
      context = null;
      const val = trimmed.replace(/^gate:\s*/, '').trim();
      if (val) result.gates.push(val);
      continue;
    }
    if (trimmed.startsWith('agent:')) {
      context = null;
      const val = trimmed.replace(/^agent:\s*/, '').trim();
      if (val && !result._legacyAgentsMap.default) result._legacyAgentsMap.default = val;
      continue;
    }

    if (context === 'requirements' && trimmed.startsWith('-')) {
      const item = trimmed.replace(/^-\s*/, '').trim();
      if (item) result.requirements.push(item);
      continue;
    }
    if (context === 'gates' && trimmed.startsWith('-')) {
      const item = trimmed.replace(/^-\s*/, '').trim();
      if (item) result.gates.push(item);
      continue;
    }
    if (context === 'agents') {
      if (trimmed.startsWith('-')) {
        // 新フォーマット: リスト形式
        const item = trimmed.replace(/^-\s*/, '').trim();
        if (item) result.agents.push(item);
        continue;
      } else if (trimmed.includes(':')) {
        // 旧フォーマット: マップ形式 → _legacyAgentsMap に格納
        const colonIdx = trimmed.indexOf(':');
        const key = trimmed.slice(0, colonIdx).trim();
        const val = trimmed.slice(colonIdx + 1).trim();
        if (key && val) result._legacyAgentsMap[key] = val;
        continue;
      }
    }
    if (context === 'skills' && trimmed.startsWith('-')) {
      const item = trimmed.replace(/^-\s*/, '').trim();
      if (item) result.skills.push(item);
      continue;
    }

    if (trimmed && !trimmed.startsWith('-') && !trimmed.startsWith('#') && context) {
      context = null;
    }
  }

  return result;
}

// ─── 操作名の抽出（「コード の 操作名」パターン） ──────────────────────────────
/**
 * 「RES002のフロント実装」「REC001 の フロントテスト」などから操作名を抽出する。
 * コードの直後に「の」または「 の 」が続き、その後に日本語の操作名が来るパターン。
 */
function extractOperation(prompt, code) {
  // パターン: {コード}[空白]*の[空白]*{操作名}
  const pattern = new RegExp(code + '\\s*の\\s*([\\u3000-\\u9FFF\\u30A0-\\u30FF\\uFF00-\\uFFEF\\u4E00-\\u9FFFa-zA-Z0-9_\\-]+(?:[\\u3000-\\u9FFF\\u30A0-\\u30FF\\uFF00-\\uFFEF\\u4E00-\\u9FFF]+)*)', 'u');
  const m = prompt.match(pattern);
  return m ? m[1].trim() : null;
}

// ─── エージェント解決 ─────────────────────────────────────────────────────────
/**
 * 操作名とエントリから使用するエージェントパスを解決する。
 *
 * 優先順:
 * 1. 操作名が agents リストにある名前と完全一致 → グローバル定義から解決
 * 2. 操作名が agents リストにある名前と部分一致
 * 3. default_agent → グローバル定義から解決
 * 4. 旧フォーマットの _legacyAgentsMap
 * 5. agents リストの先頭 → グローバル定義から解決
 */
function resolveAgent(operation, entry, globalDefs) {
  const agentNames = entry.agents || [];
  const legacyMap  = entry._legacyAgentsMap || {};
  const globalAgents = globalDefs.agents || {};

  // 新フォーマット: 操作名でマッチ
  if (operation && agentNames.length > 0) {
    // 完全一致
    const exact = agentNames.find(n => n === operation);
    if (exact) {
      const filePath = globalAgents[exact];
      if (filePath) return { name: exact, path: filePath, reason: `操作名「${operation}」で完全一致` };
    }
    // 部分一致（操作名を含む名前）
    const partial = agentNames.find(n => n.includes(operation) || operation.includes(n));
    if (partial) {
      const filePath = globalAgents[partial];
      if (filePath) return { name: partial, path: filePath, reason: `操作名「${operation}」で部分一致` };
    }
  }

  // default_agent
  if (entry.default_agent && globalAgents[entry.default_agent]) {
    return {
      name: entry.default_agent,
      path: globalAgents[entry.default_agent],
      reason: operation ? `操作名「${operation}」にマッチするエージェントなし → デフォルト` : 'デフォルト',
    };
  }

  // 旧フォーマット後方互換
  if (Object.keys(legacyMap).length > 0) {
    const legacyKey = operation
      ? (['implement', 'fix'].find(k => operation.includes(k)) || 'default')
      : 'default';
    const legacyPath = legacyMap[legacyKey] || legacyMap.default || '';
    if (legacyPath) return { name: legacyKey, path: legacyPath, reason: '旧フォーマット（後方互換）' };
  }

  // agents リストの先頭
  if (agentNames.length > 0 && globalAgents[agentNames[0]]) {
    return { name: agentNames[0], path: globalAgents[agentNames[0]], reason: 'agents リストの先頭（フォールバック）' };
  }

  return { name: '', path: '', reason: '未解決' };
}

// ─── スキル解決 ───────────────────────────────────────────────────────────────
/**
 * スキル名リストをファイルパスに解決する。
 * 返り値: [{ name, path }, ...]
 */
function resolveSkills(skillNames, globalDefs) {
  const globalSkills = globalDefs.skills || {};
  return (skillNames || []).map(name => ({
    name,
    path: globalSkills[name] || '',
  }));
}

// ─── スクリーンコード抽出 ──────────────────────────────────────────────────────
function extractCode(prompt) {
  const m = prompt.match(/\b([A-Z]{2,}[0-9]{3,})\b/);
  return m ? m[1] : null;
}

// ─── ファイル存在チェック ──────────────────────────────────────────────────────
function checkFiles(files) {
  return files.filter(f => f && !fs.existsSync(path.join(PROJECT_ROOT, f)));
}

// ─── メイン ───────────────────────────────────────────────────────────────────
async function main() {
  let raw = '';
  try {
    raw = await readStdin();
    const input   = JSON.parse(raw);
    const prompt  = input.prompt || input.content || input.message || '';
    const trimmed = prompt.trim();

    if (!trimmed.startsWith('/omc-teams 3')) {
      process.stdout.write(raw);
      process.exit(0);
    }

    const commandLabel = '/omc-teams 3';
    const code   = extractCode(trimmed);
    const refMap = parseReference();
    const globalDefs = refMap._global || { agents: {}, skills: {} };

    // ── コードが未登録 → STOP ────────────────────────────────────────────────
    if (!code || !refMap[code]) {
      const knownCodes = Object.keys(refMap).filter(k => k !== '_global').join(', ') || '（未登録）';
      const stopPrompt = `[OMC STOP] 作業を開始できません。

${!code
  ? '⚠️  スクリーンコードが指定されていません。'
  : `⚠️  スクリーンコード "${code}" が .claude/hooks/reference.md に登録されていません。`}

.claude/hooks/reference.md に以下の形式で追加してから再実行してください:

\`\`\`
## ${code || 'XXXNNN'}

\`\`\`yaml
requirements:
  - docs/01_アプリ/.../仕様書.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_1.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
default_agent: フロント実装
\`\`\`
\`\`\`

使用可能なエージェント名と操作名は .claude/hooks/reference.md の「グローバル定義」セクションを参照してください。

現在登録済みのコード: ${knownCodes}`;

      process.stdout.write(JSON.stringify({ ...input, prompt: stopPrompt }));
      process.exit(0);
    }

    // ── 解決成功 ─────────────────────────────────────────────────────────────
    const entry     = refMap[code];
    const operation = extractOperation(trimmed, code);
    const agent     = resolveAgent(operation, entry, globalDefs);
    const skills    = resolveSkills(entry.skills, globalDefs);

    const checkTargets = [
      ...entry.requirements,
      ...entry.gates,
      entry.structure,
      agent.path,
      ...skills.map(s => s.path),
    ].filter(Boolean);
    const missing = checkFiles(checkTargets);

    const missingSection = missing.length > 0
      ? `\n⚠️ **存在しないファイルがあります:**\n${missing.map(f => `- ${f}`).join('\n')}\n`
      : '';

    const gatesText = entry.gates.length > 0
      ? entry.gates.map(g => `- ${g}`).join('\n')
      : '- （未指定）';

    const skillsText = skills.length > 0
      ? skills.map(s => `- ${s.name}${s.path ? ` （\`${s.path}\`）` : ' ⚠️ 未定義'}`).join('\n')
      : '- （なし）';

    const availableAgents = (entry.agents || []).map(n => {
      const p = (globalDefs.agents || {})[n];
      return `- ${n}${p ? ` （\`${p}\`）` : ' ⚠️ 未定義'}`;
    }).join('\n') || '- （なし）';

    const workflow = `
---
⚙️ **OMC 検出: ${commandLabel} / コード: ${code}**
🔓 **ファイル承認スキップ有効** (Edit / Write / Bash(git*) / Bash(npm*) / Bash(go*))
---
${missingSection}
## 解決されたファイル

**要件ファイル群:**
${entry.requirements.map(f => `- ${f}`).join('\n') || '- （なし）'}

**ゲート（コマンド定義）:**
${gatesText}

**ファイル構成参考:** ${entry.structure || '（未指定）'}

**スキル:**
${skillsText}

**選択エージェント:** ${agent.name || '（未解決）'} → \`${agent.path || '未設定'}\`
　└ 選択理由: ${agent.reason}${operation ? ` / 操作名: 「${operation}」` : ''}

**利用可能なエージェント（このコード）:**
${availableAgents}

---

## 実行指示 ※ 必ずこの順序で実行すること

1. 上記の要件ファイルをすべて **Read** で読み込み、要件を抽出する
2. ゲートファイルを読み、フェーズと制約条件を確認する
${entry.structure ? `3. ファイル構成参考 \`${entry.structure}\` を読み、ディレクトリ規約を把握する\n4.` : '3.'} スキルファイルを読み込む:
${skills.filter(s => s.path).map(s => `   - \`${s.path}\` （${s.name}）`).join('\n') || '   - （スキルなし）'}
${entry.structure ? '5.' : '4.'} \`${agent.path || '（エージェント未設定）'}\` の定義に従いサブエージェントを **並列起動** する:
   - Agent 1: spec-cross-checker（既存仕様との競合チェック）
   - Agent 2: ${agent.name || 'default'}（${agent.path ? `\`${agent.path}\`` : '未設定'}）
   - Agent 3: design-validator（設計書品質検証）
${entry.structure ? '6.' : '5.'} エージェントの結果を統合し、次のステップを提案する

**自己判断でファイルを検索したり、指示外の作業を開始してはいけません。**

---
`;

    process.stdout.write(JSON.stringify({ ...input, prompt: prompt + '\n\n' + workflow }));
    process.exit(0);

  } catch (error) {
    process.stderr.write(`[omc-trigger] Error: ${error.message}\n`);
    process.stdout.write(raw || '{}');
    process.exit(0);
  }
}

main();
