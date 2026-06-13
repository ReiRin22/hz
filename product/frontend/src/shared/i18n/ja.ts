import commonJson from '@/front_bff_shared/i18n/ja.json';
import authJson from '@/front_bff_shared/i18n/features/auth.json';
import menuJson from '@/front_bff_shared/i18n/features/menu.json';
import sideMenuJson from '@/front_bff_shared/i18n/features/sideMenu.json';
import deptInstructionJson from '@/front_bff_shared/i18n/features/deptInstruction.json';
import ordersJson from '@/front_bff_shared/i18n/features/orders.json';
import diagnosisJson from '@/front_bff_shared/i18n/features/diagnosis.json';
import karteJson from '@/front_bff_shared/i18n/features/karte.json';
import examinationJson from '@/front_bff_shared/i18n/features/examination.json';
import receptionJson from '@/front_bff_shared/i18n/features/reception.json';

export const ja = {
  common: {
    ...commonJson,
    validation: {
      ...commonJson.validation,
      minLength: (n: number) => `${n}文字以上で入力してください`,
      maxLength: (n: number) => `${n}文字以内で入力してください`,
    },
    units: {
      items: (count: number) => `${count}件`,
      persons: (count: number) => `${count}名`,
      days: (count: number) => `${count}日`,
      hoursAgo: (count: number) => `${count}時間前`,
    },
  },
  auth: authJson,
  menu: menuJson,
  sideMenu: {
    ...sideMenuJson,
    bulletinBoardDialog: {
      ...sideMenuJson.bulletinBoardDialog,
      authorPrefix: (author: string) => `投稿者: ${author}`,
    },
    memoCreateForm: {
      ...sideMenuJson.memoCreateForm,
      selectedDepts: (depts: string) => `選択中: ${depts}`,
    },
  },
  deptInstruction: {
    ...deptInstructionJson,
    orderTable: {
      ...deptInstructionJson.orderTable,
      selectOrderAria: (id: string) => `オーダー ${id} を選択`,
      statusHistoryTitle: (name: string) => `ステータス履歴 - ${name}`,
      assignedTo: (name: string) => `担当: ${name}`,
      allergyLabel: (category: string, total: number) => `${category}アレルギー${total > 1 ? `${total}件` : ''}`,
      allergyLabelMulti: (category: string, total: number) => `${category}アレルギー等${total}件`,
      age: (n: number) => `${n}歳`,
      procDetailTitle: (type: string) => `${type}の実施内容`,
      procDetailDesc: (type: string) => `当日の${type}に関連するオーダーの詳細情報`,
      procDetailTitle2: (type: string) => `${type}の詳細を表示`,
      implementedBy: (at: string, by: string) => `実施: ${at} by ${by}`,
      notesPrefix: (n: string) => `備考: ${n}`,
    },
    searchCriteria: {
      ...deptInstructionJson.searchCriteria,
      filterSummary: {
        period: (v: string) => `期間: ${v}`,
        location: (v: string) => `入外: ${v}`,
        dept: (v: string) => `診療科: ${v}`,
        orderType: (v: string) => `オーダー種: ${v}`,
        reception: (v: string) => `受付: ${v}`,
        doctor: (v: string) => `指示医: ${v}`,
        ward: (v: string) => `病棟: ${v}`,
        status: (v: string) => `ステータス: ${v}`,
        patientId: (v: string) => `患者ID: ${v}`,
        patientName: (v: string) => `患者氏名: ${v}`,
      },
    },
    screen: {
      ...deptInstructionJson.screen,
      ordersSelected: (n: number) => `${n}件のオーダーを選択中`,
      ordersDisplayed: (n: number) => `${n}件のオーダーを表示中`,
      toasts: {
        ...deptInstructionJson.screen.toasts,
        resultAbnormal: (n: number) => `検査結果を保存しました。異常値が${n}件あります。`,
        resultCritical: (n: number) => `検査結果を保存しました。緊急異常値が${n}件あります！`,
        printSuccess: (count: number, labels: string) => `${count}件のオーダーに対して${labels}を発行しました`,
        testRequested: (type: string) => `${type}に検査を依頼しました`,
      },
    },
    printDialog: {
      ...deptInstructionJson.printDialog,
      selectedCount: (n: number) => `${n}件のオーダが選択されています`,
    },
    allergyDialog: {
      ...deptInstructionJson.allergyDialog,
      title: (name: string, id: string) => `アレルギー詳細（W5） - ${name} (${id})`,
    },
    materialDialog: {
      ...deptInstructionJson.materialDialog,
      attendingInfo: (doctor: string, dept: string) => `実施医: ${doctor} / ${dept}科`,
      attendingInfoEndoscopy: (doctor: string, dept: string) => `実施医: ${doctor} / ${dept}科 / 内視鏡専門医`,
      enteredBy: (by: string, dt: string) => `入力者: ${by} / ${dt}`,
    },
    resultDialog: {
      ...deptInstructionJson.resultDialog,
      patientInfo: (name: string, id: string) => `患者: ${name} (${id})`,
      examContent: (content: string) => `検査内容: ${content}`,
      referenceRange: (range: string) => `基準値: ${range}`,
      inputSummary: (n: number) => `入力済み項目（${n}件）`,
    },
    patientIdCheck: {
      ...deptInstructionJson.patientIdCheck,
      organism: {
        ...deptInstructionJson.patientIdCheck.organism,
        practitionerScanned: (name: string) => `実施者: ${name}`,
      },
      barcodeReadInfoCard: {
        ...deptInstructionJson.patientIdCheck.barcodeReadInfoCard,
        scannedValue: (v: string) => `読取値: ${v}`,
        expectedValue: (v: string) => `期待値: ${v}`,
      },
    },
    patientSchedule: {
      ...deptInstructionJson.patientSchedule,
      implementedAt: (at: string) => `実施：${at}`,
    },
  },
  orders: {
    ...ordersJson,
    orderConfirmation: {
      ...ordersJson.orderConfirmation,
      orderList: {
        pending: (count: number) => `未確定 (${count}件)`,
        confirmed: (count: number) => `確定済み (${count}件)`,
      },
      orderInput: {
        ...ordersJson.orderConfirmation.orderInput,
        registered: (count: number) => `${count}件登録済み`,
        submitOrder: (count: number) => `オーダー確定 (${count}件)`,
        submitOrderShort: (count: number) => `確定 (${count})`,
      },
      orderDialogs: {
        ...ordersJson.orderConfirmation.orderDialogs,
        reOutput: {
          ...ordersJson.orderConfirmation.orderDialogs.reOutput,
          orderId: (id: string) => `オーダーID: ${id}`,
        },
      },
    },
    specimenOrderEntry: {
      ...ordersJson.specimenOrderEntry,
      confirmPanel: {
        ...ordersJson.specimenOrderEntry.confirmPanel,
        header: (count: number) => `オーダー確認 (${count}件)`,
      },
    },
  },
  diagnosis: {
    ...diagnosisJson,
    recordInput: {
      ...diagnosisJson.recordInput,
      draftDropdown: {
        ...diagnosisJson.recordInput.draftDropdown,
        triggerBtn: (count: number) => `下書き (${count}件)`,
      },
      schemaCreation: {
        ...diagnosisJson.recordInput.schemaCreation,
        toast: {
          ...diagnosisJson.recordInput.schemaCreation.toast,
          templateLoaded: (template: string) => `${template}テンプレートを読み込みました`,
        },
      },
      richTextEditor: {
        ...diagnosisJson.recordInput.richTextEditor,
        schemaCaption: (schemaId: string) => `シェーマ (ID: ${schemaId})`,
      },
      recordInputToolbar: {
        ...diagnosisJson.recordInput.recordInputToolbar,
        templateDesc: (name: string) => `SOAP形式の${name}用テンプレート`,
      },
    },
  },
  karte: {
    ...karteJson,
    globalMenuNav: {
      ...karteJson.globalMenuNav,
      menuItemButton: {
        moreItems: (count: number) => `...他${count}件`,
      },
      addMySetDialog: {
        ...karteJson.globalMenuNav.addMySetDialog,
        selectedLabel: (count: number) => `選択中のオーダー (${count}件)`,
      },
    },
    rightSideMenuNav: {
      ...karteJson.rightSideMenuNav,
      bulletinBoardDialog: {
        ...karteJson.rightSideMenuNav.bulletinBoardDialog,
        authorPrefix: (author: string) => `投稿者: ${author}`,
      },
      memoListView: {
        ...karteJson.rightSideMenuNav.memoListView,
        fromPrefix: (from: string) => `送信: ${from}`,
        toPrefix: (to: string) => `宛先: ${to}`,
      },
      memoCreateForm: {
        ...karteJson.rightSideMenuNav.memoCreateForm,
        selectedDepts: (depts: string) => `選択中: ${depts}`,
      },
    },
    patientHeader: {
      patientHeaderDisplay: {
        ...karteJson.patientHeader.patientHeaderDisplay,
        patientBasicInfoBlock: {
          ...karteJson.patientHeader.patientHeaderDisplay.patientBasicInfoBlock,
          ageSuffix: (age: number, gender: string) => `${age}歳 ${gender}`,
        },
        prescriptionSettingsDialog: {
          ...karteJson.patientHeader.patientHeaderDisplay.prescriptionSettingsDialog,
          patientLabel: (name: string, id: string) => `患者: ${name} (ID: ${id})`,
          successMessage: (title: string) => `処方箋発行形態を「${title}」に変更しました`,
          successDescription: (name: string, id: string) => `患者: ${name} (ID: ${id})`,
        },
        medicalInfoSharingDialog: {
          ...karteJson.patientHeader.patientHeaderDisplay.medicalInfoSharingDialog,
          patientLabel: (name: string, id: string) => `患者: ${name} (ID: ${id})`,
          successMessage: (title: string) => `医療情報共有設定を「${title}」に変更しました`,
          successDescription: (name: string, id: string) => `患者: ${name} (ID: ${id})`,
        },
      },
    },
    patientInfo: {
      ...karteJson.patientInfo,
      deleteConfirmDialog: {
        ...karteJson.patientInfo.deleteConfirmDialog,
        descriptionWithName: (name: string) => `「${name}」を削除してもよいですか？この操作は取り消せません。`,
      },
      basicInfoTab: {
        ...karteJson.patientInfo.basicInfoTab,
        bloodTypeFormat: (type: string) => `${type}型`,
      },
    },
  },
  examination: {
    ...examinationJson,
    examinationScheduling: {
      ...examinationJson.examinationScheduling,
      undecidedBadge: (count: number) => `${count}件`,
      weekRangeLabel: (start: string, end: string, year: string) => `${start} - ${end} (${year}年)`,
      calendarMonthLabel: (year: number, month: number) => `${year}年${month}月`,
      undecidedBanner: (examType: string) => `「${examType}」の予約日時を設定中`,
      toast: {
        ...examinationJson.examinationScheduling.toast,
        scheduleConfirmed: (examType: string, date: string, time: string) =>
          `${examType}の予約を${date} ${time}に確定しました`,
        reservationCreatedConfirmed: (examType: string, date: string, time: string) =>
          `${examType}の予約を${date} ${time}に確定しました`,
      },
      patientReservationList: {
        ...examinationJson.examinationScheduling.patientReservationList,
        patientInfo: (name: string, id: string) => `${name} (ID: ${id})`,
        countAll: (total: number, exam: number, appointment: number) =>
          `全${total}件 (検査: ${exam}件、診療: ${appointment}件)`,
        countSingle: (total: number) => `全${total}件`,
        targetResource: (name: string) => `担当: ${name}`,
      },
    },
  },
  reception: {
    ...receptionJson,
    receptionPatientList: {
      ...receptionJson.receptionPatientList,
      patientList: {
        ...receptionJson.receptionPatientList.patientList,
        cancelConsultationDesc: (name: string) =>
          `${name}さんの診察終了を取り消し、未実施（○）に戻します。`,
        cancelSuccessToast: (name: string) => `${name}さんの診察終了を取り消しました`,
      },
    },
  },
} as const;
