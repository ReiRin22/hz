"use client";

import "./tmp.css";
import Link from "next/link";
import { useState, useCallback } from "react";

type Item = { id: string; label: string; href?: string };
type Lv3 = { name: string; items: Item[] };
type Lv2 = { name: string; sections: Lv3[] };
type Lv1 = { name: string; color: string; groups: Lv2[] };

const MENU_DATA: Lv1[] = [
  {
    name: "01_診療記録・診断管理",
    color: "color-01",
    groups: [
      {
        name: "01_診療記録作成・管理",
        sections: [
          {
            name: "01_診察記録入力",
            items: [
              { id: "REC001", label: "REC001 診察記録入力", href: "/dev/diagnosis/record-creation/examination-input/REC001" },
              { id: "REC002", label: "REC002 シェーマ作成機能", href: "/dev/diagnosis/record-creation/examination-input/REC002" },
            ],
          },
          {
            name: "02_経過記録記載機能",
            items: [{ id: "REC003", label: "REC003 経過記録記載機能" }],
          },
          {
            name: "02_申し送り機能",
            items: [{ id: "REC004", label: "REC004 申し送り機能" }],
          },
        ],
      },
      {
        name: "02_診療情報参照・共有・作成",
        sections: [
          {
            name: "01_診療情報参照",
            items: [{ id: "REC005", label: "REC005 診療情報参照", href: "/dev/diagnosis/medical-info-reference/medical-info-view/REC005" }],
          },
          {
            name: "02_薬歴参照",
            items: [{ id: "REC006", label: "REC006 薬歴参照", href: "/dev/diagnosis/medical-info-reference/medication-history/REC006" }],
          },
          {
            name: "03_外部ビューワ",
            items: [{ id: "REC007", label: "REC007 外部ビューワ" }],
          },
          {
            name: "03_検査結果参照",
            items: [{ id: "REC008", label: "REC008 検査結果参照", href: "/dev/diagnosis/medical-info-reference/test-results/REC008" }],
          },
          {
            name: "04_他院診療情報参照",
            items: [{ id: "REC009", label: "REC009 他院診療情報参照" }],
          },
          {
            name: "05_健診情報参照",
            items: [{ id: "REC010", label: "REC010 健診情報参照" }],
          },
        ],
      },
      {
        name: "02_看護業務支援（記録・実施）",
        sections: [
          {
            name: "06_外来カルテオーバービュー",
            items: [{ id: "REC011", label: "REC011 外来カルテオーバービュー" }],
          },
        ],
      },
      {
        name: "03_診断・病名管理",
        sections: [
          {
            name: "01_病名登録",
            items: [{ id: "REC012", label: "REC012 病名登録" }],
          },
        ],
      },
      {
        name: "04_文書作成・管理",
        sections: [
          {
            name: "01_文書作成",
            items: [{ id: "REC013", label: "REC013 文書作成" }],
          },
          {
            name: "01_栄養管理計画書",
            items: [{ id: "REC014", label: "REC014 栄養管理計画書" }],
          },
          {
            name: "01_薬剤管理サマリ",
            items: [{ id: "REC015", label: "REC015 薬剤管理サマリ" }],
          },
          {
            name: "01_看護支援文書作成支援",
            items: [{ id: "REC016", label: "REC016 看護支援文書作成支援" }],
          },
          {
            name: "02_受領文書取込",
            items: [{ id: "REC017", label: "REC017 受領文書取込" }],
          },
          {
            name: "03_文書管理",
            items: [{ id: "REC018", label: "REC018 文書管理", href: "/dev/diagnosis/document-management/document-mgmt/REC018" }],
          },
        ],
      },
      {
        name: "05_他科依頼",
        sections: [
          {
            name: "01_他科依頼",
            items: [{ id: "REC019", label: "REC019 他科依頼", href: "/dev/diagnosis/interdepartmental-request/dept-request/REC019" }],
          },
        ],
      },
      {
        name: "06_受診者一覧",
        sections: [
          {
            name: "01_受診者一覧",
            items: [{ id: "REC020", label: "REC020 受診者一覧", href: "/dev/diagnosis/patient-list/patient-list" }],
          },
        ],
      },
    ],
  },
  {
    name: "02_代行入力",
    color: "color-02",
    groups: [
      {
        name: "01_代行入力",
        sections: [
          {
            name: "01_代行入力",
            items: [{ id: "PRI001", label: "PRI001 代行入力" }],
          },
          {
            name: "02_代行入力承認",
            items: [{ id: "PRI002", label: "PRI002 代行入力承認" }],
          },
          {
            name: "03_代行入力（オーダ）",
            items: [{ id: "PRI003", label: "PRI003 代行入力（オーダ）" }],
          },
          {
            name: "04_代行入力差戻し",
            items: [{ id: "PRI004", label: "PRI004 代行入力差戻し" }],
          },
        ],
      },
    ],
  },
  {
    name: "03_患者管理",
    color: "color-03",
    groups: [
      {
        name: "01_患者基本情報管理",
        sections: [
          { name: "01_患者基本情報参照", items: [{ id: "PAT001", label: "PAT001 患者基本情報参照" }] },
          { name: "02_家族・キーパーソン情報", items: [{ id: "PAT002", label: "PAT002 家族・キーパーソン情報" }] },
          { name: "03_アレルギー・既往歴管理", items: [{ id: "PAT003", label: "PAT003 アレルギー・既往歴管理" }] },
          { name: "04_生活習慣・嗜好", items: [{ id: "PAT004", label: "PAT004 生活習慣・嗜好" }] },
          { name: "05_感染症", items: [{ id: "PAT005", label: "PAT005 感染症" }] },
          { name: "06_診療メモ", items: [{ id: "PAT006", label: "PAT006 診療メモ" }] },
          { name: "07_ACP情報", items: [{ id: "PAT013", label: "PAT013 ACP情報" }] },
          { name: "08_インプラント・デバイス情報", items: [{ id: "PAT014", label: "PAT014 インプラント・デバイス情報" }] },
          { name: "09_予防接種", items: [{ id: "PAT015", label: "PAT015 予防接種" }] },
          { name: "10_患者検索機能", items: [{ id: "PAT007", label: "PAT007 患者検索機能" }] },
        ],
      },
      {
        name: "02_患者情報セキュリティ",
        sections: [
          { name: "01_アクセス制御", items: [{ id: "PAT008", label: "PAT008 アクセス制御" }] },
          { name: "02_アクセスログ管理", items: [{ id: "PAT009", label: "PAT009 アクセスログ管理" }] },
        ],
      },
      {
        name: "03_患者一覧",
        sections: [
          { name: "01_患者一覧", items: [{ id: "PAT010", label: "PAT010 患者一覧" }] },
          { name: "01_指定病名使用患者一覧", items: [{ id: "PAT011", label: "PAT011 指定病名使用患者一覧" }] },
          { name: "01_指定診療行為使用患者一覧", items: [{ id: "PAT012", label: "PAT012 指定診療行為使用患者一覧" }] },
        ],
      },
    ],
  },
  {
    name: "04_受付・予約管理",
    color: "color-04",
    groups: [
      {
        name: "01_外来受付・問診",
        sections: [
          { name: "01_受付処理", items: [{ id: "REG001", label: "REG001 受付処理", href: "/dev/reception/outpatient-reception/reception/REG001"  }]},
          { name: "02_検査予約", items: [{ id: "REG002", label: "REG002 検査予約", href: "/dev/reception/outpatient-reception/exam-reservation/REG003" }] },
          { name: "02_診療予約", items: [{ id: "REG003", label: "REG003 診療予約", href: "/dev/reception/outpatient-reception/exam-reservation/REG003" }] },
          { name: "03_問診", items: [{ id: "REG004", label: "REG004 問診", href: "/dev/reception/outpatient-reception/reception/REG001" }] },
        ],
      },
    ],
  },
  {
    name: "05_オーダリング",
    color: "color-05",
    groups: [
      {
        name: "01_処方オーダー",
        sections: [
          { name: "01_オーダー設定（リフィル処方含む）", items: [{ id: "ORD001", label: "ORD001 オーダー設定", href: "/dev/order/prescription-order/drug-info/ORD001" }] },
          { name: "01_薬剤情報表示", items: [{ id: "ORD002", label: "ORD002 薬剤情報表示", href: "/dev/order/prescription-order/drug-info/ORD002" }] },
          { name: "02_薬剤アレルギーチェック", items: [{ id: "ORD003", label: "ORD003 薬剤アレルギーチェック", href: "/dev/order/prescription-order/allergy-check/ORD003" }] },
          { name: "02_併用禁忌チェック", items: [{ id: "ORD004", label: "ORD004 併用禁忌チェック", href: "/dev/order/prescription-order/contraindication-check/ORD004" }] },
          { name: "02_重複投薬チェック", items: [{ id: "ORD005", label: "ORD005 重複投薬チェック", href: "/dev/order/prescription-order/duplicate-medication-check/ORD005" }] },
          { name: "02_患者属性適合性チェック", items: [{ id: "ORD006", label: "ORD006 患者属性適合性チェック", href: "/dev/order/prescription-order/patient-profile-check/ORD006" }] },
          { name: "03_院外処方箋の電子署名・印刷", items: [{ id: "ORD007", label: "ORD007 院外処方箋の電子署名・印刷", href: "/dev/order/prescription-order/external-prescription/ORD007" }] },
          { name: "04_院内処方箋の電子署名・印刷", items: [{ id: "ORD008", label: "ORD₀₀₈ 院内処方箋の電子署名・印刷", href: "/dev/order/prescription-order/internal-prescription/ORD₀₀₈" }] },
          { name: "₀₅_オーダ出力帳票（処方）", items: [{ id: "_ORD₀₀₉", label: "_ORD₀₀₉ オーダ出力帳票（処方）", href: "/dev/order/prescription-order/output-forms/_ORD₀₀₉" }] },
          { name: "₀₆_オーダー連携（処方）", items: [{ id: "_ORD₀₁₀", label: "_ORD₀₁₀ オーダー連携（処方）", href: "/dev/order/prescription-order/integration/_ORD₀₁₀" }] },
        ],
      },
      {
        name: "02_注射オーダー",
        sections: [
          { name: "01_注射指示入力・設定", items: [{ id: "ORD011", label: "ORD011 注射指示入力・設定" }] },
          { name: "02_オーダ出力帳票（注射）", items: [{ id: "ORD015", label: "ORD015 オーダ出力帳票（注射）" }] },
          { name: "03_オーダー連携（注射）", items: [{ id: "ORD016", label: "ORD016 オーダー連携（注射）" }] },
        ],
      },
      {
        name: "03_処置オーダー",
        sections: [
          { name: "01_オーダー設定（処置）", items: [{ id: "ORD017", label: "ORD017 オーダー設定（処置）" }] },
          { name: "02_オーダ出力帳票（処置）", items: [{ id: "ORD018", label: "ORD018 オーダ出力帳票（処置）" }] },
          { name: "03_オーダー連携（処置）", items: [{ id: "ORD019", label: "ORD019 オーダー連携（処置）" }] },
        ],
      },
      {
        name: "04_指導オーダー",
        sections: [
          { name: "01_オーダー設定（指導）", items: [{ id: "ORD020", label: "ORD020 オーダー設定（指導）" }] },
          { name: "02_オーダ出力帳票（指導）", items: [{ id: "ORD021", label: "ORD021 オーダ出力帳票（指導）" }] },
          { name: "03_オーダー連携（指導）", items: [{ id: "ORD022", label: "ORD022 オーダー連携（指導）" }] },
        ],
      },
      {
        name: "05_検体検査オーダー",
        sections: [
          { name: "01_オーダー設定（検体）", items: [{ id: "ORD023", label: "ORD023 オーダー設定（検体）" }] },
          { name: "02_オーダー連携（検体）", items: [{ id: "ORD024", label: "ORD024 オーダー連携（検体）" }] },
          { name: "03_オーダ出力帳票（検体）", items: [{ id: "ORD025", label: "ORD025 オーダ出力帳票（検体）" }] },
        ],
      },
      {
        name: "06_生理検査オーダー",
        sections: [
          { name: "01_オーダー設定（生理）", items: [{ id: "ORD026", label: "ORD026 オーダー設定（生理）" }] },
          { name: "02_オーダ出力帳票（生理）", items: [{ id: "ORD027", label: "ORD027 オーダ出力帳票（生理）" }] },
          { name: "03_オーダー連携（生理）", items: [{ id: "ORD028", label: "ORD028 オーダー連携（生理）" }] },
        ],
      },
      {
        name: "07_内視鏡検査オーダー",
        sections: [
          { name: "01_オーダー設定（内視鏡）", items: [{ id: "ORD029", label: "ORD029 オーダー設定（内視鏡）" }] },
          { name: "02_オーダ出力帳票（内視鏡）", items: [{ id: "ORD030", label: "ORD030 オーダ出力帳票（内視鏡）" }] },
          { name: "03_オーダー連携（内視鏡）", items: [{ id: "ORD031", label: "ORD031 オーダー連携（内視鏡）" }] },
        ],
      },
      {
        name: "08_画像検査オーダー",
        sections: [
          { name: "01_オーダー設定（画像）", items: [{ id: "ORD032", label: "ORD032 オーダー設定（画像）" }] },
          { name: "02_チェック（画像）", items: [{ id: "ORD033", label: "ORD033 チェック（画像）" }] },
          { name: "03_オーダ出力帳票（画像）", items: [{ id: "ORD034", label: "ORD034 オーダ出力帳票（画像）" }] },
          { name: "04_オーダー連携（画像）", items: [{ id: "ORD035", label: "ORD035 オーダー連携（画像）" }] },
        ],
      },
      {
        name: "09_病理検査オーダー",
        sections: [
          { name: "01_オーダー設定（病理）", items: [{ id: "ORD036", label: "ORD036 オーダー設定（病理）" }] },
          { name: "02_オーダ出力帳票（病理）", items: [{ id: "ORD037", label: "ORD037 オーダ出力帳票（病理）" }] },
          { name: "03_オーダー連携（病理）", items: [{ id: "ORD038", label: "ORD038 オーダー連携（病理）" }] },
        ],
      },
      {
        name: "10_細菌検査オーダー",
        sections: [
          { name: "01_オーダー設定（細菌）", items: [{ id: "ORD039", label: "ORD039 オーダー設定（細菌）" }] },
          { name: "02_オーダ出力帳票（細菌）", items: [{ id: "ORD040", label: "ORD040 オーダ出力帳票（細菌）" }] },
          { name: "03_オーダー連携（細菌）", items: [{ id: "ORD041", label: "ORD041 オーダー連携（細菌）" }] },
        ],
      },
      {
        name: "11_汎用オーダー",
        sections: [
          { name: "01_オーダー設定（汎用）", items: [{ id: "ORD042", label: "ORD042 オーダー設定（汎用）" }] },
          { name: "02_オーダ出力帳票（汎用）", items: [{ id: "ORD043", label: "ORD043 オーダ出力帳票（汎用）" }] },
          { name: "03_オーダー連携（汎用）", items: [{ id: "ORD044", label: "ORD044 オーダー連携（汎用）" }] },
        ],
      },
      {
        name: "12_複合オーダー",
        sections: [
          { name: "01_オーダー設定（複合）", items: [{ id: "ORD045", label: "ORD045 オーダー設定（複合）" }] },
          { name: "02_オーダ出力帳票（複合）", items: [{ id: "ORD046", label: "ORD046 オーダ出力帳票（複合）" }] },
          { name: "03_オーダー連携（複合）", items: [{ id: "ORD047", label: "ORD047 オーダー連携（複合）" }] },
        ],
      },
      {
        name: "13_食事オーダー",
        sections: [
          { name: "01_オーダー設定（食事）", items: [{ id: "ORD048", label: "ORD048 オーダー設定（食事）" }] },
          { name: "02_オーダ出力帳票（食事）", items: [{ id: "ORD049", label: "ORD049 オーダ出力帳票（食事）" }] },
          { name: "03_オーダー連携（食事）", items: [{ id: "ORD050", label: "ORD050 オーダー連携（食事）" }] },
        ],
      },
      {
        name: "14_リハビリオーダー",
        sections: [
          { name: "01_オーダー設定（リハビリ）", items: [{ id: "ORD051", label: "ORD051 オーダー設定（リハビリ）" }] },
          { name: "02_リハビリ処方箋", items: [{ id: "ORD052", label: "ORD052 リハビリ処方箋" }] },
          { name: "03_リハビリ計画書", items: [{ id: "ORD053", label: "ORD053 リハビリ計画書" }] },
          { name: "04_オーダー連携（リハビリ）", items: [{ id: "ORD054", label: "ORD054 オーダー連携（リハビリ）" }] },
        ],
      },
      {
        name: "15_輸血オーダー",
        sections: [
          { name: "01_オーダー設定（輸血）", items: [{ id: "ORD055", label: "ORD055 オーダー設定（輸血）" }] },
          { name: "02_オーダー連携（輸血）", items: [{ id: "ORD057", label: "ORD057 オーダー連携（輸血）" }] },
        ],
      },
      {
        name: "16_手術オーダー",
        sections: [
          { name: "01_オーダー設定（手術）", items: [{ id: "ORD058", label: "ORD058 オーダー設定（手術）" }] },
          { name: "02_オーダー連携（手術）", items: [{ id: "ORD060", label: "ORD060 オーダー連携（手術）" }] },
        ],
      },
      {
        name: "17_透析オーダー",
        sections: [
          { name: "01_オーダー設定（透析）", items: [{ id: "ORD061", label: "ORD061 オーダー設定（透析）" }] },
          { name: "02_オーダー連携（透析）", items: [{ id: "ORD063", label: "ORD063 オーダー連携（透析）" }] },
        ],
      },
      {
        name: "18_入退院・転棟オーダー",
        sections: [
          { name: "01_オーダー設定（入院）", items: [{ id: "ORD064", label: "ORD064 オーダー設定（入院）" }] },
          { name: "02_オーダ出力帳票（入院）", items: [{ id: "ORD065", label: "ORD065 オーダ出力帳票（入院）" }] },
          { name: "03_オーダー連携（入院）", items: [{ id: "ORD066", label: "ORD066 オーダー連携（入院）" }] },
          { name: "04_病床・期間管理", items: [{ id: "ORD067", label: "ORD067 病床・期間管理" }] },
          { name: "05_オーダー設定（退院）", items: [{ id: "ORD068", label: "ORD068 オーダー設定（退院）" }] },
          { name: "05_オーダ出力帳票（退院）", items: [{ id: "ORD069", label: "ORD069 オーダ出力帳票（退院）" }] },
          { name: "05_オーダー連携（退院）", items: [{ id: "ORD070", label: "ORD070 オーダー連携（退院）" }] },
          { name: "06_オーダー設定（転棟）", items: [{ id: "ORD071", label: "ORD071 オーダー設定（転棟）" }] },
          { name: "06_オーダ出力帳票（転棟）", items: [{ id: "ORD072", label: "ORD072 オーダ出力帳票（転棟）" }] },
          { name: "06_オーダー連携（転棟）", items: [{ id: "ORD073", label: "ORD073 オーダー連携（転棟）" }] },
        ],
      },
      {
        name: "19_看護ケアオーダー",
        sections: [
          { name: "01_オーダー設定（看護ケア）", items: [{ id: "ORD074", label: "ORD074 オーダー設定（看護ケア）" }] },
          { name: "02_オーダー連携（看護ケア）", items: [{ id: "ORD075", label: "ORD075 オーダー連携（看護ケア）" }] },
          { name: "03_オーダー確定", items: [{ id: "ORD076", label: "ORD076 オーダー確定", href: "/dev/order/nursing-care-order/order-confirm/ORD076"}] },
          { name: "04_オーダリングセット登録", items: [{ id: "ORD077", label: "ORD077 オーダリングセット登録" }] },
        ],
      },
    ],
  },
  {
    name: "06_検査結果管理",
    color: "color-06",
    groups: [
      {
        name: "01_検査結果参照・表示",
        sections: [
          { name: "01_検査結果参照・表示", items: [{ id: "RES001", label: "RES001 検査結果参照・表示" }] },
        ],
      },
      {
        name: "02_結果入力",
        sections: [
          { name: "01_結果入力", items: [{ id: "RES002", label: "RES002 結果入力", href: "/dev/exam-result/result-input/result-entry/RES002" }] },
          { name: "01_結果通知", items: [{ id: "RES003", label: "RES003 結果通知" }] },
        ],
      },
      {
        name: "03_帳票出力",
        sections: [
          { name: "01_帳票出力", items: [{ id: "RES004", label: "RES004 帳票出力" }] },
        ],
      },
    ],
  },
  {
    name: "07_看護管理",
    color: "color-07",
    groups: [
      {
        name: "01_看護業務管理",
        sections: [
          { name: "01_病棟日誌", items: [{ id: "NUR001", label: "NUR001 病棟日誌" }] },
          { name: "02_看護管理日誌", items: [{ id: "NUR002", label: "NUR002 看護管理日誌" }] },
          { name: "03_病院日誌", items: [{ id: "NUR003", label: "NUR003 病院日誌" }] },
          { name: "04_外来日誌", items: [{ id: "NUR004", label: "NUR004 外来日誌" }] },
        ],
      },
      {
        name: "02_空床/稼働率管理",
        sections: [
          { name: "01_空床管理", items: [{ id: "NUR005", label: "NUR005 空床管理" }] },
          { name: "02_稼働率管理", items: [{ id: "NUR006", label: "NUR006 稼働率管理" }] },
        ],
      },
    ],
  },
  {
    name: "08_看護支援",
    color: "color-08",
    groups: [
      {
        name: "01_病床管理",
        sections: [
          { name: "01_移動情報登録", items: [{ id: "NSP001", label: "NSP001 移動情報登録" }] },
          { name: "01_担当者登録・変更", items: [{ id: "NSP002", label: "NSP002 担当者登録・変更" }] },
          { name: "01_ワークシート発行", items: [{ id: "NSP003", label: "NSP003 ワークシート発行" }] },
          { name: "01_ワークシート実施入力", items: [{ id: "NSP004", label: "NSP004 ワークシート実施入力" }] },
          { name: "01_各種一覧", items: [{ id: "NSP005", label: "NSP005 各種一覧" }] },
        ],
      },
      {
        name: "02_移動情報管理",
        sections: [
          { name: "01_入退院・転棟・転科等", items: [{ id: "NSP006", label: "NSP006 入退院・転棟・転科等" }] },
        ],
      },
      {
        name: "03_看護業務支援（記録・実施）",
        sections: [
          { name: "01_温度板（経過記録表）", items: [{ id: "NSP007", label: "NSP007 温度板（経過記録表）" }] },
          { name: "02_経過記録", items: [{ id: "NSP008", label: "NSP008 経過記録" }] },
          { name: "03_看護データベース(アナムネ)", items: [{ id: "NSP009", label: "NSP009 看護データベース" }] },
          { name: "04_サマリ", items: [{ id: "NSP010", label: "NSP010 サマリ" }] },
          { name: "04_退院サマリ", items: [{ id: "NSP011", label: "NSP011 退院サマリ" }] },
        ],
      },
      {
        name: "04_指示管理（指示受け）",
        sections: [
          { name: "01_食事箋管理", items: [{ id: "NSP012", label: "NSP012 食事箋管理",href: "/dev/nursing-support/instruction-management/meal-form-mgmt/NSP012" }] },
          { name: "02_入院看護指示受け", items: [{ id: "NSP013", label: "NSP013 入院看護指示受け" }] },
        ],
      },
      {
        name: "05_入院時・入院中指示",
        sections: [
          { name: "01_入院診療計画", items: [{ id: "NSP014", label: "NSP014 入院診療計画" }] },
          { name: "02_予測指示", items: [{ id: "NSP015", label: "NSP015 予測指示" }] },
          { name: "03_持参薬管理", items: [{ id: "NSP016", label: "NSP016 持参薬管理" }] },
          { name: "04_食事変更", items: [{ id: "NSP017", label: "NSP017 食事変更" }] },
        ],
      },
      {
        name: "06_服薬・注射実施管理",
        sections: [
          { name: "01_服薬管理", items: [{ id: "NSP019a", label: "NSP019 服薬管理" }] },
          { name: "02_注射管理", items: [{ id: "NSP020a", label: "NSP020 注射管理" }] },
        ],
      },
      {
        name: "07_看護過程",
        sections: [
          { name: "01_看護診断", items: [{ id: "NSP018", label: "NSP018 看護診断" }] },
          { name: "02_問題点リスト", items: [{ id: "NSP019b", label: "NSP019 問題点リスト" }] },
          { name: "03_看護計画", items: [{ id: "NSP020b", label: "NSP020 看護計画" }] },
          { name: "04_看護介入", items: [{ id: "NSP021", label: "NSP021 看護介入" }] },
          { name: "05_看護記録", items: [{ id: "NSP022", label: "NSP022 看護記録" }] },
          { name: "06_看護評価", items: [{ id: "NSP023", label: "NSP023 看護評価" }] },
        ],
      },
      {
        name: "08_看護評価",
        sections: [
          { name: "01_看護度・救護区分", items: [{ id: "NSP024", label: "NSP024 看護度・救護区分" }] },
          { name: "02_看護必要度", items: [{ id: "NSP025", label: "NSP025 看護必要度" }] },
          { name: "03_日常生活機能評価", items: [{ id: "NSP026", label: "NSP026 日常生活機能評価" }] },
          { name: "04_医療区分・ADL評価", items: [{ id: "NSP027", label: "NSP027 医療区分・ADL評価" }] },
          { name: "05_尿路確認リスト", items: [{ id: "NSP028", label: "NSP028 尿路確認リスト" }] },
        ],
      },
      {
        name: "09_傷病管理支援",
        sections: [
          { name: "01_褥瘡管理", items: [{ id: "NSP029", label: "NSP029 褥瘡管理" }] },
          { name: "01_褥瘡観察（DESIGN-R）", items: [{ id: "NSP030", label: "NSP030 褥瘡観察（DESIGN-R）" }] },
          { name: "01_褥瘡計画書", items: [{ id: "NSP031", label: "NSP031 褥瘡計画書" }] },
          { name: "01_危険因子評価表", items: [{ id: "NSP032", label: "NSP032 危険因子評価表" }] },
          { name: "01_日別評価表（様式46）", items: [{ id: "NSP033", label: "NSP033 日別評価表（様式46）" }] },
          { name: "01_月間評価表", items: [{ id: "NSP034", label: "NSP034 月間評価表" }] },
        ],
      },
      {
        name: "10_制度系",
        sections: [
          { name: "01_看護必要度集計", items: [{ id: "NSP035", label: "NSP035 看護必要度集計" }] },
          { name: "01_医療区分集計", items: [{ id: "NSP036", label: "NSP036 医療区分集計" }] },
        ],
      },
    ],
  },
  {
    name: "09_部門指示受け",
    color: "color-09",
    groups: [
      {
        name: "01_部門指示受け",
        sections: [
          { name: "01_外来看護指示受け", items: [{ id: "DEP001", label: "DEP001 外来看護指示受け", href: "/dev/dept-instruction/dept-instruction/outpatient-nursing/DEP001" }] },
          { name: "02_検査科指示受け", items: [{ id: "DEP002", label: "DEP002 検査科指示受け", href: "/dept-instruction/lab-instruction" }] },
          { name: "03_放射線科指示受け", items: [{ id: "DEP003", label: "DEP003 放射線科指示受け", href: "/dev/dept-instruction/dept-instruction/radiology-instruction/DEP003" }] },
          { name: "04_栄養科指示受け", items: [{ id: "DEP004", label: "DEP004 栄養科指示受け" }] },
          { name: "05_手術・輸血指示受け", items: [{ id: "DEP005", label: "DEP005 手術・輸血指示受け" }] },
          { name: "06_薬剤科指示受け", items: [{ id: "DEP006", label: "DEP006 薬剤科指示受け" }] },
          { name: "07_リハビリ科指示受け", items: [{ id: "DEP007", label: "DEP007 リハビリ科指示受け"}] },
          { name: "08_透析指示受け", items: [{ id: "DEP008", label: "DEP008 透析指示受け", href: "/dev/dept-instruction/dept-instruction/dialysis-instruction/DEP008" }] },
          { name: "09_患者取り違い防止チェック", items: [{ id: "DEP009", label: "DEP009 患者取り違い防止チェック", href: "/dept-instruction/patient-id-check/DEP009" }] },
          { name: "10_指示受け・指示元オーダ編集", items: [{ id: "DEP010", label: "DEP010 指示受け・指示元オーダ編集" }] },
          { name: "11_内視鏡検査科指示受け", items: [{ id: "DEP011", label: "DEP011 内視鏡検査科指示受け", href: "/dev/dept-instruction/dept-instruction/endoscopy-instruction/DEP011" }] },
        ],
      },
    ],
  },
  {
    name: "10_外部部門システム（院内）",
    color: "color-10",
    groups: [
      {
        name: "01_医事・事務系システム",
        sections: [
          { name: "01_医事会計システム", items: [{ id: "EXT001", label: "EXT001 医事会計システム" }] },
        ],
      },
      {
        name: "02_診療情報・報告支援",
        sections: [
          { name: "01_様式1（外来）", items: [{ id: "EXT002", label: "EXT002 様式1（外来）" }] },
          { name: "01_様式1（入院）", items: [{ id: "EXT003", label: "EXT003 様式1（入院）" }] },
          { name: "02_DPC", items: [{ id: "EXT004", label: "EXT004 DPC" }] },
        ],
      },
      {
        name: "03_医療系部門システム",
        sections: [
          { name: "01_検体検査システム", items: [{ id: "EXT005", label: "EXT005 検体検査システム" }] },
          { name: "01_外注検査", items: [{ id: "EXT006", label: "EXT006 外注検査" }] },
          { name: "01_検査機器", items: [{ id: "EXT007", label: "EXT007 検査機器" }] },
          { name: "02_PACS", items: [{ id: "EXT008", label: "EXT008 PACS" }] },
          { name: "02_MWM", items: [{ id: "EXT009", label: "EXT009 MWM" }] },
          { name: "02_RIS", items: [{ id: "EXT010", label: "EXT010 RIS" }] },
          { name: "03_生理検査システム", items: [{ id: "EXT011", label: "EXT011 生理検査システム" }] },
          { name: "03_心電図・骨密度", items: [{ id: "EXT012", label: "EXT012 心電図・骨密度" }] },
          { name: "04_内視鏡システム", items: [{ id: "EXT013", label: "EXT013 内視鏡システム" }] },
          { name: "05_外注細菌検査業者", items: [{ id: "EXT014", label: "EXT014 外注細菌検査業者" }] },
          { name: "05_外注病理検査業者", items: [{ id: "EXT015", label: "EXT015 外注病理検査業者" }] },
        ],
      },
      {
        name: "04_リハビリ部門システム",
        sections: [
          { name: "01_リハビリシステム", items: [{ id: "EXT018", label: "EXT018 リハビリシステム" }] },
        ],
      },
      {
        name: "05_手術・透析管理支援",
        sections: [
          { name: "01_透析管理システム", items: [{ id: "EXT019", label: "EXT019 透析管理システム" }] },
          { name: "02_手術室管理システム", items: [{ id: "EXT020", label: "EXT020 手術室管理システム" }] },
          { name: "02_輸血管理システム", items: [{ id: "EXT021", label: "EXT021 輸血管理システム" }] },
        ],
      },
      {
        name: "06_入退院支援",
        sections: [
          { name: "01_地域連携支援システム", items: [{ id: "EXT023", label: "EXT023 地域連携支援システム" }] },
          { name: "02_給食管理システム", items: [{ id: "EXT024", label: "EXT024 給食管理システム" }] },
        ],
      },
      {
        name: "07_事務系システム",
        sections: [
          { name: "01_健診システム", items: [{ id: "EXT025", label: "EXT025 健診システム" }] },
          { name: "02_診断書作成支援システム", items: [{ id: "EXT026", label: "EXT026 診断書作成支援システム" }] },
          { name: "03_再来受付機", items: [{ id: "EXT027", label: "EXT027 再来受付機" }] },
        ],
      },
      {
        name: "08_人事管理系システム",
        sections: [
          { name: "01_出退勤システム", items: [{ id: "EXT028", label: "EXT028 出退勤システム" }] },
        ],
      },
      {
        name: "09_看護業務体制・勤務管理支援",
        sections: [
          { name: "01_勤務管理システム", items: [{ id: "EXT029", label: "EXT029 勤務管理システム" }] },
        ],
      },
      {
        name: "10_入院業務支援系システム",
        sections: [
          { name: "01_ナースコールシステム", items: [{ id: "EXT030", label: "EXT030 ナースコールシステム" }] },
          { name: "02_見守りシステム", items: [{ id: "EXT031", label: "EXT031 見守りシステム" }] },
          { name: "03_離床検知システム", items: [{ id: "EXT032", label: "EXT032 離床検知システム" }] },
          { name: "04_バイタルシステム", items: [{ id: "EXT033", label: "EXT033 バイタルシステム" }] },
        ],
      },
      {
        name: "11_院内システム認証基盤",
        sections: [
          { name: "01_二要素認証", items: [{ id: "EXT034", label: "EXT034 二要素認証" }] },
          { name: "01_シングルサインオン", items: [{ id: "EXT035", label: "EXT035 シングルサインオン" }] },
        ],
      },
      {
        name: "12_ユーザー・認証管理",
        sections: [
          { name: "01_ユーザー管理", items: [{ id: "EXT036", label: "EXT036 ユーザー管理" }] },
          { name: "01_アクセス制御", items: [{ id: "EXT037", label: "EXT037 アクセス制御" }] },
        ],
      },
    ],
  },
  {
    name: "11_外部部門システム（院外）",
    color: "color-11",
    groups: [
      {
        name: "01_地域・外部連携",
        sections: [
          { name: "01_介護システム", items: [{ id: "EXO001", label: "EXO001 介護システム" }] },
        ],
      },
      {
        name: "02_地域医療情報ネットワーク",
        sections: [
          { name: "01_地域医療情報ネットワーク", items: [{ id: "EXO002", label: "EXO002 地域医療情報ネットワーク" }] },
        ],
      },
      {
        name: "03_全国医療情報プラットフォーム",
        sections: [
          { name: "01_オンライン資格確認", items: [{ id: "EXO003", label: "EXO003 オンライン資格確認" }] },
          { name: "02_電子処方箋管理", items: [{ id: "EXO004", label: "EXO004 電子処方箋管理" }] },
          { name: "03_電子カルテ共有サービス", items: [{ id: "EXO005", label: "EXO005 電子カルテ共有サービス" }] },
          { name: "04_特定健診", items: [{ id: "EXO006", label: "EXO006 特定健診" }] },
        ],
      },
      {
        name: "04_在宅診療看護連携支援",
        sections: [
          { name: "01_在宅管理システム", items: [{ id: "EXO007", label: "EXO007 在宅管理システム" }] },
        ],
      },
      {
        name: "05_医療安全管理",
        sections: [
          { name: "01_インシデント報告", items: [{ id: "EXO008", label: "EXO008 インシデント報告" }] },
        ],
      },
    ],
  },
  {
    name: "12_電子カルテ共通基盤",
    color: "color-12",
    groups: [
      {
        name: "01_共通基盤",
        sections: [
          { name: "01_認証・認可", items: [{ id: "PLT001", label: "PLT001 認証・認可" }] },
          { name: "02_ヘルプ機能", items: [{ id: "PLT002", label: "PLT002 ヘルプ機能" }] },
          { name: "03_お知らせ・通知", items: [{ id: "PLT003", label: "PLT003 お知らせ・通知" }] },
          { name: "04_エラーメッセージ制御", items: [{ id: "PLT004", label: "PLT004 エラーメッセージ制御" }] },
          { name: "05_ログ管理", items: [{ id: "PLT005", label: "PLT005 ログ管理" }] },
          { name: "06_時間管理", items: [{ id: "PLT006", label: "PLT006 時間管理" }] },
          { name: "07_印刷機能", items: [{ id: "PLT007", label: "PLT007 印刷機能" }] },
          { name: "08_ファイル添付／参照", items: [{ id: "PLT008", label: "PLT008 ファイル添付／参照" }] },
          { name: "09_カレンダー・日付選択", items: [{ id: "PLT009", label: "PLT009 カレンダー・日付選択" }] },
          { name: "10_検索・フィルタリング", items: [{ id: "PLT010", label: "PLT010 検索・フィルタリング" }] },
        ],
      },
      {
        name: "02_情報共有・掲示",
        sections: [
          { name: "01_掲示板", items: [{ id: "PLT011", label: "PLT011 掲示板" }] },
          { name: "01_伝言メモ", items: [{ id: "PLT012", label: "PLT012 伝言メモ" }] },
          { name: "02_付箋機能", items: [{ id: "PLT013", label: "PLT013 付箋機能" }] },
          { name: "02_TODO（付箋）", items: [{ id: "PLT014", label: "PLT014 TODO（付箋）" }] },
        ],
      },
      {
        name: "03_コミュニケーション",
        sections: [
          { name: "01_チャット", items: [{ id: "PLT015", label: "PLT015 チャット" }] },
        ],
      },
    ],
  },
  {
    name: "13_電子カルテ共通基盤（Harz外オプション）",
    color: "color-13",
    groups: [
      {
        name: "01_コミュニケーション",
        sections: [
          { name: "01_スケジューラ", items: [{ id: "PLO063", label: "PLO063 スケジューラ" }] },
          { name: "02_プレゼンス機能", items: [{ id: "PLO064", label: "PLO064 プレゼンス機能" }] },
        ],
      },
    ],
  },
  {
    name: "14_データウェアハウス（統計）",
    color: "color-14",
    groups: [
      {
        name: "01_診療統計",
        sections: [
          { name: "01_オーダー統計", items: [{ id: "DWH001", label: "DWH001 オーダー統計" }] },
          { name: "01_食事集計", items: [{ id: "DWH002", label: "DWH002 食事集計" }] },
          { name: "02_病名統計", items: [{ id: "DWH003a", label: "DWH003 病名統計" }] },
          { name: "03_文書ステータス管理", items: [{ id: "DWH003b", label: "DWH003 文書ステータス管理" }] },
          { name: "04_外来患者数集計", items: [{ id: "DWH004", label: "DWH004 外来患者数集計" }] },
          { name: "04_ジェネリック使用率", items: [{ id: "DWH005", label: "DWH005 ジェネリック使用率" }] },
          { name: "04_疾患分類表統計", items: [{ id: "DWH006", label: "DWH006 疾患分類表統計" }] },
          { name: "04_被ばく線量管理", items: [{ id: "DWH007", label: "DWH007 被ばく線量管理" }] },
          { name: "04_指定病名件数出力", items: [{ id: "DWH008", label: "DWH008 指定病名件数出力" }] },
        ],
      },
      {
        name: "02_経営系",
        sections: [
          { name: "01_診療時間・待ち時間分析", items: [{ id: "DWH011", label: "DWH011 診療時間・待ち時間分析" }] },
          { name: "02_病院統計", items: [{ id: "DWH012", label: "DWH012 病院統計" }] },
        ],
      },
      {
        name: "03_データ連携",
        sections: [
          { name: "01_カルテ参照", items: [{ id: "DWH013", label: "DWH013 カルテ参照" }] },
        ],
      },
    ],
  },
  {
    name: "15_セキュリティ/アクセス管理",
    color: "color-15",
    groups: [
      {
        name: "01_操作・監査ログ管理",
        sections: [
          { name: "01_ログ管理", items: [{ id: "SEC001", label: "SEC001 ログ管理" }] },
        ],
      },
      {
        name: "02_通知・監視・アラート設定",
        sections: [
          { name: "01_通知・アラート設定", items: [{ id: "SEC002", label: "SEC002 通知・アラート設定" }] },
        ],
      },
      {
        name: "03_システム設定・パラメータ管理",
        sections: [
          { name: "01_各種パラメーター設定", items: [{ id: "SEC003", label: "SEC003 各種パラメーター設定" }] },
        ],
      },
      {
        name: "04_外部接続・インターフェース管理",
        sections: [
          { name: "01_インターフェース管理", items: [{ id: "SEC004", label: "SEC004 インターフェース管理" }] },
        ],
      },
    ],
  },
  {
    name: "16_メニュー・共通ヘッダ",
    color: "color-16",
    groups: [
      {
        name: "01_メニュー・共通ヘッダ",
        sections: [
          { name: "01_ログイン画面", items: [{ id: "ETC001", label: "ETC001 ログイン画面", href: "/dev/ui-common/menu-header/login/ETC001" }] },
          { name: "01_メニュー画面", items: [{ id: "ETC002", label: "ETC002 メニュー画面", href: "/dev/ui-common/menu-header/menu/ETC002" }] },
          { name: "01_患者情報ヘッダ表示", items: [{ id: "ETC003", label: "ETC003 患者情報ヘッダ表示", href: "/dev/ui-common/menu-header/patient-header/ETC003" }] },
          { name: "01_カルテ画面左サイドメニュー", items: [{ id: "ETC004", label: "ETC004 カルテ画面左サイドメニュー", href: "/dev/ui-common/menu-header/left-sidemenu/ETC004" }] },
          { name: "01_カルテ画面右サイドメニュー", items: [{ id: "ETC005", label: "ETC005 カルテ画面右サイドメニュー", href: "/dev/ui-common/menu-header/right-sidemenu/ETC005" }] },
          { name: "01_ユーザーヘッダ表示", items: [{ id: "ETC006", label: "ETC006 ユーザーヘッダ表示", href: "/dev/ui-common/menu-header/user-header/ETC006" }] },
        ],
      },
    ],
  },
];

function Lv2Block({
  group,
  colorClass,
}: {
  group: Lv2;
  colorClass: string;
}) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  return (
    <div className={`lv2-group ${colorClass}`}>
      <div
        className={`lv2-header ${open ? "open" : ""}`}
        onClick={toggle}
        role="button"
        aria-expanded={open}
      >
        <span>{group.name}</span>
        <span className="chevron">▶</span>
      </div>
      <div className={`lv2-content ${open ? "open" : ""}`}>
        {group.sections.map((sec) => (
          <div key={sec.name}>
            <div className="lv3-label">{sec.name}</div>
            <ul className="feature-list">
              {sec.items.map((item) => (
                <li key={item.id}>
                  {item.href ? (
                    <Link href={item.href}>{item.label}</Link>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function Lv1Block({ lv1 }: { lv1: Lv1 }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  return (
    <div className="lv1-group">
      <div
        className={`lv1-header ${lv1.color} ${open ? "open" : ""}`}
        onClick={toggle}
        role="button"
        aria-expanded={open}
      >
        <span>{lv1.name}</span>
        <span className="chevron">▶</span>
      </div>
      <div className={`lv1-content ${lv1.color} ${open ? "open" : ""}`}>
        {lv1.groups.map((group) => (
          <Lv2Block key={group.name} group={group} colorClass={lv1.color} />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="harz-menu h-full overflow-y-auto">
      <div className="fixed top-20 left-6 z-50 flex flex-col gap-4">
        <div className="group">
          <Link
            href="/ui-common/menu-header/login"
            className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl transition-transform duration-200 group-hover:scale-125 text-xs font-bold text-center leading-tight"
            aria-label="ログイン"
          >
            ログイン
          </Link>
          <div className="absolute left-20 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
            <p>ID: demo</p>
            <p>PASS: demo123</p>
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-800" />
          </div>
        </div>
        <div className="group">
          <Link
            href="/diagnosis/record-management/clinical-entry"
            className="w-16 h-16 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center shadow-xl transition-transform duration-200 group-hover:scale-125 text-xs font-bold text-center leading-tight"
            aria-label="sample"
          >
            sample
          </Link>
          <div className="absolute left-20 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
            診療記録入力 (CLT001)
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-800" />
          </div>
        </div>
      </div>
      <h1>Harz Menu</h1>
      {MENU_DATA.map((lv1) => (
        <Lv1Block key={lv1.name} lv1={lv1} />
      ))}
    </main>
  );
}
