#!/usr/bin/env node
/**
 * screen-code-detector.js
 *
 * ユーザー入力に機能コード（例: RES002, ORD023）が含まれている場合、
 * structure_2.md から正確なディレクトリ階層情報を取得して注入する。
 *
 * トリガーパターン: [A-Z]{3}[0-9]{3} （アルファベット3文字 + 数字3桁）
 *
 * 例:
 * - REC002 → product/frontend/src/features/01_diagnosis/01_record-creation/01_schema-creation
 * - ORD023 → product/frontend/src/features/05_order/05_specimen-order/01_specimen-setting
 * - ETC001 → product/frontend/src/features/16_ui-common/01_menu-header/01_login
 */

const fs = require('fs');
const path = require('path');

// 環境変数から入力を取得
const userInput = process.env.USER_INPUT || '';

// 機能コードのパターンマッチ（アルファベット3文字 + 数字3桁）
const FEATURE_CODE_PATTERN = /\b[A-Z]{3}[0-9]{3}\b/g;
const matches = userInput.match(FEATURE_CODE_PATTERN);

if (!matches) {
  // 機能コードが含まれていない場合は何もしない
  process.exit(0);
}

// 重複を除去
const uniqueCodes = [...new Set(matches)];

// structure_2.md から機能コードとパスのマッピングを取得
const structurePath = path.join(process.cwd(), '.claude/commands/structure_2.md');

if (!fs.existsSync(structurePath)) {
  console.error(`[screen-code-detector] ERROR: structure_2.md not found at ${structurePath}`);
  process.exit(0);
}

const structureContent = fs.readFileSync(structurePath, 'utf-8');

// structure_2.md から機能コードのディレクトリパスを抽出する関数
function extractDirectoryPath(code, structureContent) {
  // structure_2.md のパターン例:
  // │   │   ├── 01_schema-creation/                  # LV3: シェーマ作成機能      [REC002]

  const lines = structureContent.split('\n');

  // [CODE] パターンを含む行を探す
  const targetLine = lines.find(line => line.includes(`[${code}]`));

  if (!targetLine) {
    return null;
  }

  // 例: │   │   ├── 01_schema-creation/                  # LV3: シェーマ作成機能      [REC002]
  //     │   ├── 01_login/                            # LV3: ログイン画面          [ETC001]
  // LV3 ディレクトリ名を抽出（├── または └── に対応）
  const lv3Match = targetLine.match(/[├└]──\s+(\d+_[\w-]+)\//);
  if (!lv3Match) {
    return null;
  }
  const lv3Dir = lv3Match[1]; // 01_schema-creation

  // LV3 の説明（日本語名）を抽出
  const lv3DescMatch = targetLine.match(/#\s*LV3:\s*([^\[]+)/);
  const lv3Desc = lv3DescMatch ? lv3DescMatch[1].trim() : '';

  // LV3 行のインデント深度を確認
  const lv3IndentMatch = targetLine.match(/^([\s│]*)/);
  const lv3Indent = lv3IndentMatch ? lv3IndentMatch[1].length : 0;

  // LV2 を探す（LV3 より浅いインデント）
  const lv2Line = findParentLevel(lines, lines.indexOf(targetLine), lv3Indent);
  if (!lv2Line) {
    return null;
  }

  const lv2Match = lv2Line.match(/[├└]──\s+(\d+_[\w-]+)\//);
  if (!lv2Match) {
    return null;
  }
  const lv2Dir = lv2Match[1]; // 01_record-creation

  // LV2 の説明（日本語名）を抽出
  const lv2DescMatch = lv2Line.match(/#\s*LV2:\s*([^\n]+)/);
  const lv2Desc = lv2DescMatch ? lv2DescMatch[1].trim() : '';

  // LV2 のインデント深度
  const lv2IndentMatch = lv2Line.match(/^([\s│]*)/);
  const lv2Indent = lv2IndentMatch ? lv2IndentMatch[1].length : 0;

  // LV1 を探す（LV2 より浅いインデント）
  const lv1Line = findParentLevel(lines, lines.indexOf(lv2Line), lv2Indent);
  if (!lv1Line) {
    return null;
  }

  const lv1Match = lv1Line.match(/[├└]──\s+(\d+_[\w-]+)\//);
  if (!lv1Match) {
    return null;
  }
  const lv1Dir = lv1Match[1]; // 01_diagnosis

  // LV1 の説明（日本語名）を抽出
  const lv1DescMatch = lv1Line.match(/#\s*LV1:\s*([^\n]+)/);
  const lv1Desc = lv1DescMatch ? lv1DescMatch[1].trim() : '';

  return {
    code,
    lv1: {
      dir: lv1Dir,
      name: lv1Desc
    },
    lv2: {
      dir: lv2Dir,
      name: lv2Desc
    },
    lv3: {
      dir: lv3Dir,
      name: lv3Desc
    },
    featurePath: `features/${lv1Dir}/${lv2Dir}/${lv3Dir}`,
    fullPath: `product/frontend/src/features/${lv1Dir}/${lv2Dir}/${lv3Dir}`
  };
}

// 指定行より上で、指定インデントより浅い行を探す
function findParentLevel(lines, startIndex, childIndent) {
  for (let i = startIndex - 1; i >= 0; i--) {
    const line = lines[i];
    if (!line.trim()) continue; // 空行スキップ

    const indentMatch = line.match(/^([\s│]*)/);
    const indent = indentMatch ? indentMatch[1].length : 0;

    // 親階層（より浅いインデント）を発見（├── または └── を含む行）
    if (indent < childIndent && (line.includes('├──') || line.includes('└──'))) {
      return line;
    }
  }
  return null;
}

// 各機能コードのディレクトリ情報を取得
const featureInfos = uniqueCodes
  .map(code => extractDirectoryPath(code, structureContent))
  .filter(info => info !== null);

if (featureInfos.length === 0) {
  // 該当する機能が見つからない場合は何もしない
  process.exit(0);
}

// 注入するメッセージを生成
const injectionMessage = `
<system-reminder>
[screen-code-detector] 機能コード検出: ${uniqueCodes.join(', ')}

以下の機能のディレクトリ階層情報:

${featureInfos.map(info => `
**${info.code}** — ${info.lv3.name}

階層構造:
- **LV1（機能群）**: \`${info.lv1.dir}\` — ${info.lv1.name}
- **LV2（業務フロー）**: \`${info.lv2.dir}\` — ${info.lv2.name}
- **LV3（画面機能）**: \`${info.lv3.dir}\` — ${info.lv3.name}

ディレクトリパス:
- Features パス: \`${info.featurePath}\`
- 完全パス: \`${info.fullPath}\`

主要ディレクトリ:
\`\`\`
${info.fullPath}/
├── api/           # BFF通信ロジック（axiosClient使用）
├── assets/        # 画面固有の画像・アイコン・静的ファイル
├── components/    # 画面固有のMolecules / Organisms
│   ├── molecules/ # 特定目的の最小限ロジック部品
│   └── organisms/ # 複数Moleculesを束ねる大きな単位
├── hooks/         # 画面固有の対話ロジック（useQuery等）
├── stores/        # 画面状態管理（Zustand）
├── types/         # UI表示用の型（ViewModel等）
├── repository/    # データ取得・永続化ロジック（React Query等）
├── test/          # 単体・結合テスト（Vitest/MSW）
├── stories/       # Storybook Storyファイル
├── style.css      # 画面固有スタイル定義
└── index.ts       # 機能公開窓口
\`\`\`
`).join('\n')}

**参照規約**:
- ディレクトリ構造の全体図: \`.claude/commands/structure_2.md\`
- 命名規則: \`.claude/commands/frontend-naming-conventions.md\`
- TypeScript型管理: \`docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/03_TypeScript型管理/TypeScript型管理規約.md\`

</system-reminder>
`.trim();

console.log(injectionMessage);
process.exit(0);
