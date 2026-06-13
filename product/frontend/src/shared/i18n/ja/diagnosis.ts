export const diagnosis = {
  recordInput: {
    // DraftDropdown
    draftDropdown: {
      triggerBtn: (count: number) => `下書き (${count}件)`,
      sectionHeader: "保存された下書き",
    },

    // RecordDateInput
    recordDateInput: {
      label: "記載日",
    },

    // RecorderSelect
    recorderSelect: {
      label: "記載者",
      doctorGroup: "医師",
      nurseGroup: "看護師",
      clerkGroup: "医療事務",
    },

    // VoiceInputIndicator
    voiceInputIndicator: {
      activeText: "音声入力中... 話してください",
      stopBtn: "停止",
      interimLabel: "認識中:",
    },

    // CommentTabs
    commentTabs: {
      myTab: "Myコメント",
      patientTab: "患者別",
      departmentTab: "診療科",
    },

    // DraggablePopupHeader
    draggablePopupHeader: {
      manageBtn: "Myコメント管理",
      closeAria: "閉じる",
    },

    // TextFormattingToolbar
    textFormattingToolbar: {
      label: "文字装飾:",
      bold: { tooltip: "太字", syntax: "**テキスト**" },
      underline: { tooltip: "下線", syntax: "__テキスト__" },
      red: { tooltip: "赤マーカー（緊急/警告）", syntax: "[赤]テキスト[/赤]" },
      yellow: { tooltip: "黄マーカー（注意）", syntax: "[黄]テキスト[/黄]" },
      list: { tooltip: "箇条書き", syntax: "- 項目" },
      heading: { tooltip: "見出し", syntax: "## 見出し" },
    },

    // SchemaCreation
    schemaCreation: {
      toolbarTitle: "描画ツール",
      colorLabel: "線の色",
      lineWidthLabel: "線幅",
      drawingModeLabel: "描画モード",
      textInputLabel: "テキスト入力",
      textInputPlaceholder: "テキストを入力",
      insertBtn: "挿入",
      canvasTitle: "描画エリア",
      templateLabel: "テンプレート",
      addToRecordBtn: "診療記録に追加",
      cancelBtn: "キャンセル",
      clearBtn: "クリア",
      toast: {
        templateLoaded: (template: string) => `${template}テンプレートを読み込みました`,
        textInputRequired: "テキストを入力してください",
        textInserted: "テキストを挿入しました",
        textPlaceHint: "キャンバス上をクリックしてテキストを配置してください",
        imageLoaded: "画像を読み込みました",
        schemaSaved: "シェーマを保存しました",
        canvasCleared: "キャンバスをクリアしました",
      },
      templateLabels: {
        全身: "全身",
        顔: "顔",
        手: "手",
        足: "足",
        胴: "胴",
      },
      drawingModeLabels: {
        フリーハンド: "フリーハンド",
        直線: "直線",
        円: "円",
        テキスト: "テキスト",
      },
    },

    // RichTextEditor
    richTextEditor: {
      schemaAlt: "シェーマ",
      schemaCaption: (schemaId: string) => `シェーマ (ID: ${schemaId})`,
    },

    // RecordInputHeader
    recordInputHeader: {
      title: "記録入力",
      newBtn: "新規",
      tempSaveBtn: "一時保存",
      confirmBtn: "確定",
    },

    // RecordInputToolbar
    recordInputToolbar: {
      voiceBtn: "音声",
      voiceStopBtn: "停止",
      commentBtn: "コメント",
      templateBtn: "テンプレート",
      schemaBtn: "シェーマ",
      templateGroupHeading: "SOAPテンプレート",
      templateDesc: (name: string) => `SOAP形式の${name}用テンプレート`,
      schemaDialogTitle: "シェーマ作成",
      schemaDialogDesc: "シェーマを作成して診察記録に追加できます。",
    },

    // SOAPEditor
    soapEditor: {
      label: "診察記録（SOAP形式）",
    },

    // DraggableCommentPopup
    draggableCommentPopup: {
      title: "コメント選択",
    },

    // SOAP_PLACEHOLDER_TEXT (constants/medical-data.ts)
    soapPlaceholder: `SOAP形式で診察記録を記入してください

S (Subjective - 主観的情報):
・主訴：患者の主な訴えや症状
・現病歴：症状の経過、発症時期、程度の変化
・既往歴：過去の病気や手術歴
・家族歴：家族の医療歴
・社会歴：職業、生活習慣、アレルギーなど

O (Objective - 客観的情報):
・バイタルサイン：血圧、脈拍、体温、呼吸数、SpO2
・身体所見：視診、聴診、触診、打診の結果
・検査結果：血液検査、尿検査、画像検査など

A (Assessment - 評価・診断):
・診断名：疑われる疾患名
・病状評価：重症度、進行度の評価
・鑑別診断：除外すべき疾患

P (Plan - 計画・治療方針):
・治療計画：薬物療法、手術、処置など
・処方：薬剤名、用法用量、期間
・今後の方針：経過観察、次回受診、検査予定`,
  },
} as const;
