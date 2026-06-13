# 音声入力改善プラン — REC001 診察室環境音・連続収録対応
**対象機能**: REC001 診療記録入力  
**作成日**: 2026-05-14  
**ステータス**: 計画確定・実装待ち

---

## Web Speech API の基本動作（前提知識）

| 項目 | 内容 |
|------|------|
| **APIキー** | **不要** — ブラウザ組み込み。課金なし |
| **動作条件** | HTTPS 必須（localhost は例外で HTTP でも動作）|
| **ブラウザ対応** | Chrome / Edge ◎、Safari △（iOS Safari は制限あり）、Firefox ✗ |
| **マイク入力** | PC/タブレット内蔵マイク・外付けマイクどちらも利用可 |
| **データの流れ** | Chrome の場合、音声データが **Google のサーバーへ送信** されて認識結果が返る |
| **日本語** | `lang='ja-JP'` 設定で対応済み |
| **話者識別** | **不可** — 単一マイクで全音声を混合して認識する |

→ **「診察室の環境音（医師・患者の会話）を全部拾う」用途に適合する。**  
→ ただし「誰が話したか」の自動識別は Web Speech API 単体では不可能。手動ラベル付きで対応する。

---

## 現状の問題点（調査結果）

### 実装ファイル
`features/01_diagnosis/01_record-creation/01_examination-input/hooks/useVoiceInput.ts`

### 現状設定と課題

| 設定項目 | 現在値 | 課題 |
|----------|--------|------|
| `continuous` | `false`（行32） | **単発認識のみ** — 1発話で停止する。診察室で話し続けると途中で切れる |
| `interimResults` | `false`（行33） | **確定テキストのみ** — 話している最中のリアルタイム表示なし |
| `maxAlternatives` | 未設定（デフォルト1） | 誤認識時の代替候補なし |
| `onerror` | **未実装** | network/no-speech/audio-capture エラーで無音停止する |
| `onend` 後の再起動 | **なし** | 沈黙タイムアウト後に自動で再起動しない |
| タイムアウト制御 | **なし** | ブラウザ任せ（Chromeは約7秒沈黙で自動停止） |
| 文字数上限 | **なし**（ストア・エディタとも） | 際限なく連結される。BFF/DB制約と乖離する可能性 |
| テキスト連結 | `soapText + transcript`（行37） | 発話ごとに空白・改行の区切りなし。可読性低 |
| VoiceInputIndicator | `interimTranscript` prop あり（行5） | フックが interim を渡していないため常に空表示 |

---

## 改善計画

### Phase A — 連続収録・品質向上（優先度：高）

診察室で複数人が話し続けても止まらない連続認識に改善する。

#### A-1. `useVoiceInput.ts` の改修

```typescript
// 変更前
recognition.continuous = false;
recognition.interimResults = false;

// 変更後
recognition.continuous = true;   // 連続認識ON
recognition.interimResults = true; // 中間結果をリアルタイム表示
recognition.maxAlternatives = 1;
```

**自動再起動ロジック追加**（沈黙タイムアウト対策）:
```typescript
recognition.onend = () => {
  // isVoiceActive が true のままなら再起動（ブラウザの自動停止に対応）
  if (isVoiceActive) {
    recognition.start();
  } else {
    setIsVoiceActive(false);
  }
};
```

**エラーハンドリング追加**:
```typescript
recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
  switch (event.error) {
    case 'no-speech':
      // 沈黙継続 → 再起動（自動再起動ループで対処済みのため無視）
      break;
    case 'audio-capture':
      setVoiceError('マイクにアクセスできません。許可設定を確認してください。');
      setIsVoiceActive(false);
      break;
    case 'network':
      setVoiceError('音声認識サービスへの接続に失敗しました。');
      setIsVoiceActive(false);
      break;
    case 'not-allowed':
      setVoiceError('マイクの使用が許可されていません。');
      setIsVoiceActive(false);
      break;
    default:
      setVoiceError(`音声認識エラー: ${event.error}`);
      setIsVoiceActive(false);
  }
};
```

**中間認識テキストをストアへ渡す**:
```typescript
recognition.onresult = (event: SpeechRecognitionEvent) => {
  let interim = '';
  let final = '';
  for (let i = event.resultIndex; i < event.results.length; i++) {
    const t = event.results[i][0].transcript;
    if (event.results[i].isFinal) {
      final += t;
    } else {
      interim += t;
    }
  }
  if (final) {
    // 発話ごとに改行で区切る
    setSoapText(soapText + (soapText ? '\n' : '') + final);
  }
  setInterimTranscript(interim); // VoiceInputIndicator に渡す
};
```

#### A-2. `recordInput.store.ts` の改修

```typescript
// 追加するフィールド
interimTranscript: string;           // 認識中テキスト（確定前）
setInterimTranscript: (t: string) => void;
voiceError: string | null;           // エラーメッセージ
setVoiceError: (e: string | null) => void;
```

#### A-3. 文字数上限の設定

BFF の `CreateClinicalRecordRequest` スキーマに合わせて上限を設ける。

**推奨上限**: `soapText` 10,000文字（診察1回分として十分な量）

```typescript
// recordInput.store.ts の setSoapText にガード追加
setSoapText: (text: string) => {
  const MAX_CHARS = 10000;
  set({ soapText: text.slice(0, MAX_CHARS) });
},
```

```tsx
// RecordInputOrganism.tsx — 文字数カウンター表示
<span className={soapText.length > 9000 ? 'text-red-500' : 'text-muted-foreground'}>
  {soapText.length} / 10,000
</span>
```

---

### Phase B — 話者ラベル手動付与（優先度：中）

Web Speech API で「誰が話したか」を自動識別することは**技術的に不可能**。  
→ **手動プレフィックスボタン**で対応する。

#### B-1. 話者ラベルボタン UI

VoiceInputIndicator または Toolbar に以下のボタンを追加:

```
[医師] [患者] [入力者]
```

クリックすると現在のカーソル位置または末尾に改行+ラベルを挿入:

```
医師: 今日の体調はいかがですか？
患者: 昨日から咳が続いています。
医師: 熱は測りましたか？
患者: 37.5度でした。
```

```typescript
// useVoiceInput.ts または hooks/useSpeakerLabel.ts（新規）
const insertSpeakerLabel = (speaker: '医師' | '患者' | '入力者') => {
  const prefix = `\n${speaker}: `;
  setSoapText(soapText + prefix);
};
```

#### B-2. VoiceInputIndicator の更新

現在 `interimTranscript` prop は存在するが常に空文字。A-1 の対応後に正しく表示される。  
話者ラベルボタンを VoiceInputIndicator 内に追加する。

---

### Phase C — 将来拡張（スコープ外・参考）

自動話者識別が必要になった場合の選択肢。APIキーが必要になる。

| 技術 | 概要 | 費用 |
|------|------|------|
| Azure Cognitive Services — Speaker Diarization | 音声ファイル解析で話者ごとにテキスト分割 | $1/時間 |
| OpenAI Whisper + pyannote | Whisper でテキスト化 + pyannote で話者識別 | $0.006/分 + OSS |
| Azure OpenAI Whisper（Japan East） | HIPAA対応・国内保管 | Azure 料金 |

いずれも**音声ファイルをサーバーに送信**する構成になるため、  
院内PHI（個人医療情報）の取扱い方針を先に確認すること。

---

## 実装スコープまとめ

### Phase A（今すぐ実施可能・APIキー不要）

| タスク | 変更ファイル | 変更内容 |
|--------|------------|---------|
| A-1 | `hooks/useVoiceInput.ts` | `continuous=true`, `interimResults=true`, 自動再起動, エラーハンドリング |
| A-2 | `stores/recordInput.store.ts` | `interimTranscript`, `voiceError` フィールド追加 |
| A-3 | `stores/recordInput.store.ts` | `setSoapText` に 10,000文字ガード |
| A-4 | `components/organisms/RecordInputOrganism.tsx` | 文字数カウンター表示 |
| A-5 | `front_bff_shared/.../schemas/recordInput.schema.ts` | `soapText: z.string().max(10000)` |

### Phase B（UIデザイン確認後に実施）

| タスク | 変更ファイル | 変更内容 |
|--------|------------|---------|
| B-1 | `hooks/useVoiceInput.ts` または `hooks/useSpeakerLabel.ts`（新規） | 話者ラベル挿入ロジック |
| B-2 | `components/molecules/VoiceInputIndicatorMolecule.tsx` | 話者ラベルボタン（医師/患者/入力者）追加 |

---

## 受入条件

- [ ] 音声入力ボタンを押した後、**複数の発話を止めずに連続してテキスト化**できる
- [ ] 認識中（確定前）のテキストが VoiceInputIndicator にリアルタイム表示される
- [ ] 沈黙が続いてもボタンを押して停止するまで**自動で再起動**し続ける
- [ ] マイク未許可・ネットワークエラー時に**日本語エラーメッセージ**が表示される
- [ ] テキストが 10,000文字に達すると**カウンターが赤表示**になり、それ以上入力されない
- [ ] 話者ラベルボタン（医師/患者/入力者）をクリックすると**テキスト末尾にラベルが挿入**される
- [ ] 発話と発話の間に**改行**が入り読みやすいフォーマットになる

---

## 次のアクション

1. **Phase A** を `/implement` で実施（APIキー不要、今すぐ可能）
2. 話者ラベルのUI位置（VoiceInputIndicator内 vs Toolbar内）をデザイン確認
3. 文字数上限 10,000文字でよいか DB/BFF 担当と確認
4. PHI取扱い方針の確認（Phase Cへ進む場合のみ必要）
