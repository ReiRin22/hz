import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/atoms/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/components/atoms/select";
import { Input } from "@shared/components/atoms/input";
import { Label } from "@shared/components/atoms/label";
import { Button } from "@shared/components/atoms/button";
import { Badge } from "@shared/components/atoms/badge";
import { Textarea } from "@shared/components/atoms/textarea";
import { Progress } from "@shared/components/atoms/progress";
import { Plus, X, Pill, FlaskConical, Stethoscope, Send, Activity, Droplets, Microscope, Eye, BookOpen, Clock, FileText, Zap, AlertCircle, Syringe, Scissors, Clipboard, Users, Heart, Bug } from "lucide-react";
import { useState, useRef } from "react";



interface Order {
  id: string;
  type: "prescription" | "injection" | "procedure" | "guidance" | "lab" | "physiology" | "endoscopy" | "imaging" | "pathology" | "microbiology" | "general" | "rehabilitation" | "transfusion" | "surgery" | "dialysis";
  name: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
  priority?: string; // 手術・輸血用の優先度
  amount?: string;   // 輸血用の量
}

interface OrderInputProps {
  orders: Order[];
  onOrdersChange: (orders: Order[]) => void;
  onSubmitOrders: () => void;
  onPrescriptionOrderOpen?: () => void;
}

const orderTypes = {
  prescription: { 
    label: "処方", 
    icon: Pill, 
    color: "bg-purple-600", 
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    textColor: "text-purple-700 dark:text-purple-300"
  },
  injection: { 
    label: "注射", 
    icon: Syringe, 
    color: "bg-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    textColor: "text-emerald-700 dark:text-emerald-300"
  },
  procedure: { 
    label: "処置", 
    icon: Scissors, 
    color: "medical-secondary",
    bgColor: "medical-bg-secondary",
    borderColor: "medical-border-secondary",
    textColor: "medical-text-secondary"
  },
  guidance: { 
    label: "指導", 
    icon: BookOpen, 
    color: "bg-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    borderColor: "border-amber-200 dark:border-amber-800",
    textColor: "text-amber-700 dark:text-amber-300"
  },
  lab: { 
    label: "検査（血液・尿等）", 
    icon: FlaskConical, 
    color: "bg-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    borderColor: "border-orange-200 dark:border-orange-800",
    textColor: "text-orange-700 dark:text-orange-300"
  },
  physiology: { 
    label: "生理検査", 
    icon: Activity, 
    color: "bg-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-800",
    textColor: "text-red-700 dark:text-red-300"
  },
  endoscopy: { 
    label: "内視鏡", 
    icon: Eye, 
    color: "bg-teal-600",
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
    borderColor: "border-teal-200 dark:border-teal-800",
    textColor: "text-teal-700 dark:text-teal-300"
  },
  imaging: { 
    label: "画像検査", 
    icon: Stethoscope, 
    color: "medical-primary",
    bgColor: "medical-bg-primary",
    borderColor: "medical-border-primary",
    textColor: "medical-text-primary"
  },
  pathology: { 
    label: "病理", 
    icon: Microscope, 
    color: "bg-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    borderColor: "border-indigo-200 dark:border-indigo-800",
    textColor: "text-indigo-700 dark:text-indigo-300"
  },
  microbiology: { 
    label: "細菌", 
    icon: Bug, 
    color: "bg-pink-600",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
    borderColor: "border-pink-200 dark:border-pink-800",
    textColor: "text-pink-700 dark:text-pink-300"
  },
  general: { 
    label: "汎用", 
    icon: Clipboard, 
    color: "bg-slate-600",
    bgColor: "bg-slate-50 dark:bg-slate-950/20",
    borderColor: "border-slate-200 dark:border-slate-800",
    textColor: "text-slate-700 dark:text-slate-300"
  },
  rehabilitation: { 
    label: "リハビリ", 
    icon: Users, 
    color: "bg-lime-600",
    bgColor: "bg-lime-50 dark:bg-lime-950/20",
    borderColor: "border-lime-200 dark:border-lime-800",
    textColor: "text-lime-700 dark:text-lime-300"
  },
  transfusion: { 
    label: "輸血", 
    icon: Heart, 
    color: "bg-rose-600",
    bgColor: "bg-rose-50 dark:bg-rose-950/20",
    borderColor: "border-rose-200 dark:border-rose-800",
    textColor: "text-rose-700 dark:text-rose-300"
  },
  surgery: { 
    label: "手術", 
    icon: Zap, 
    color: "bg-violet-600",
    bgColor: "bg-violet-50 dark:bg-violet-950/20",
    borderColor: "border-violet-200 dark:border-violet-800",
    textColor: "text-violet-700 dark:text-violet-300"
  },
  dialysis: { 
    label: "透析", 
    icon: Droplets, 
    color: "bg-cyan-600",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/20",
    borderColor: "border-cyan-200 dark:border-cyan-800",
    textColor: "text-cyan-700 dark:text-cyan-300"
  }
};

const commonMedications = [
  "アセトアミノフェン錠500mg",
  "ロキソプロフェンNa錠60mg",
  "オメプラゾールカプセル20mg",
  "アムロジピン錠5mg",
  "メトホルミン錠250mg"
];

const commonTests = [
  "血算（CBC）",
  "生化学検査（肝機能・腎機能）",
  "血糖値",
  "HbA1c",
  "CRP",
  "尿一般検査",
  "胸部X線",
  "腹部CT",
  "心電図"
];

// 処置オプション（処置・手技から分離）
const procedureOptions = [
  "創部処置（消毒・ガーゼ交換）",
  "褥瘡処置",
  "胃管挿入",
  "尿道カテーテル挿入",
  "吸引（口腔・鼻腔）",
  "酸素療法",
  "ネブライザー",
  "包帯交換",
  "縫合処置",
  "抜糸",
  "ドレーン管理",
  "気管切開孔管理",
  "人工呼吸器管理",
  "体位変換",
  "理学療法"
];

// 注射オプション（新規追加）
const injectionOptions = [
  "静脈内注射（IV）",
  "筋肉内注射（IM）",
  "皮下注射（SC）",
  "皮内注射（ID）",
  "点滴静脈注射",
  "中心静脈注射",
  "インスリン注射",
  "ワクチン接種",
  "造影剤注射",
  "ステロイド注射",
  "抗生剤注射",
  "鎮痛剤注射",
  "利尿剤注射",
  "血管造影",
  "関節内注射"
];

const physiologyTests = [
  "心電図検査",
  "ホルター心電図",
  "心エコー検査",
  "呼吸機能検査",
  "脳波検査",
  "筋電図検査",
  "聴力検査",
  "眼底検査",
  "神経伝導速度検査"
];

const dialysisOptions = [
  "血液透析（HD）",
  "腹膜透析（PD）",
  "持続血液透析（CHD）",
  "血液濾過透析（HDF）",
  "血漿交換療法",
  "ECMO管理",
  "シャント作成術",
  "透析導入指導",
  "透析条件変更"
];

// 病理オプション（病理・細菌から分離）
const pathologyOptions = [
  "病理組織検査",
  "細胞診検査",
  "免疫組織化学染色",
  "電子顕微鏡検査",
  "分子病理学的検査",
  "術中迅速病理診断",
  "剖検・病理解剖",
  "コンサルテーション",
  "特殊染色",
  "遺伝子検査",
  "液体生検",
  "腫瘍マーカー",
  "HPE（組織学的検査）",
  "FNAC（細針穿刺細胞診）",
  "バイオプシー"
];

// 細菌オプション（病理・細菌から分離）
const microbiologyOptions = [
  "細菌培養（血液）",
  "細菌培養（喀痰）",
  "細菌培養（尿）",
  "細菌培養（便）",
  "細菌培養（創部）",
  "薬剤感受性試験",
  "グラム染色",
  "抗酸菌検査",
  "真菌検査",
  "ウイルス抗原検査",
  "PCR検査",
  "MRSA検査",
  "C.difficile検査",
  "血液培養",
  "無菌検体培養"
];

const endoscopyOptions = [
  "上部消化管内視鏡（胃カメラ）",
  "下部消化管内視鏡（大腸カメラ）",
  "気管支鏡検査",
  "膀胱鏡検査",
  "ERCP（内視鏡的逆行性胆管膵管造影）",
  "ESD（内視鏡的粘膜下層剥離術）",
  "EMR（内視鏡的粘膜切除術）",
  "内視鏡的ポリープ切除術",
  "内視鏡的止血術",
  "PEG造設術"
];

const guidanceOptions = [
  "服薬指導",
  "食事指導（糖尿病）",
  "食事指導（腎疾患）",
  "食事指導（高血圧）",
  "食事指導（脂質異常症）",
  "運動指導",
  "生活指導",
  "禁煙指導",
  "透析導入指導",
  "インスリン自己注射指導",
  "血糖測定指導",
  "在宅酸素療法指導",
  "褥瘡ケア指導"
];

// 汎用オプション（新規追加）
const generalOptions = [
  "安静度指示",
  "食事形態変更",
  "入浴許可",
  "外出許可",
  "面会制限",
  "感染対策",
  "転科依頼",
  "退院準備",
  "他科コンサルト",
  "社会保障相談",
  "医療連携室依頼",
  "栄養科依頼",
  "薬剤科依頼",
  "看護指示",
  "その他指示"
];

// リハビリオプション（新規追加）
const rehabilitationOptions = [
  "理学療法（PT）",
  "作業療法（OT）",
  "言語聴覚療法（ST）",
  "歩行訓練",
  "筋力増強訓練",
  "関節可動域訓練",
  "日常生活動作訓練",
  "嚥下訓練",
  "構音訓練",
  "認知機能訓練",
  "呼吸リハビリ",
  "心臓リハビリ",
  "がんリハビリ",
  "訪問リハビリ",
  "外来リハビリ"
];

// 輸血オプション（新規追加）
const transfusionOptions = [
  "赤血球液（RCC）",
  "血小板液（PC）",
  "新鮮凍結血漿（FFP）",
  "クリオプレシピテート",
  "アルブミン製剤",
  "免疫グロブリン製剤",
  "血液凝固因子製剤",
  "自己血輸血",
  "洗浄血小板",
  "放射線照射血液",
  "CMV陰性血液",
  "血液型適合性検査",
  "交差適合試験",
  "不規則抗体検査",
  "輸血後検査"
];

// 手術オプション（新規追加）
const surgeryOptions = [
  "全身麻酔手術",
  "局所麻酔手術",
  "内視鏡手術",
  "腹腔鏡手術",
  "胸腔鏡手術",
  "関節鏡手術",
  "ロボット手術",
  "日帰り手術",
  "救急手術",
  "予定手術",
  "手術室確保",
  "麻酔科依頼",
  "手術部位マーキング",
  "術前検査",
  "術後管理"
];

export function OrderInput({ 
  orders, 
  onOrdersChange, 
  onSubmitOrders,
  onPrescriptionOrderOpen
}: OrderInputProps) {
  const [newOrder, setNewOrder] = useState<Partial<Order>>({
    type: "prescription",
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    priority: "",
    amount: ""
  });



  const addOrder = () => {
    if (!newOrder.name) return;
    
    const order: Order = {
      id: Date.now().toString(),
      type: newOrder.type as Order["type"],
      name: newOrder.name,
      dosage: newOrder.dosage,
      frequency: newOrder.frequency,
      duration: newOrder.duration,
      instructions: newOrder.instructions,
      priority: newOrder.priority,
      amount: newOrder.amount
    };
    
    onOrdersChange([...orders, order]);
    setNewOrder({
      type: "prescription",
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      priority: "",
      amount: ""
    });
  };

  const removeOrder = (id: string) => {
    onOrdersChange(orders.filter(order => order.id !== id));
  };

  const getOrderOptions = () => {
    switch (newOrder.type) {
      case "prescription":
        return commonMedications;
      case "lab":
      case "imaging":
        return commonTests;
      case "procedure":
        return procedureOptions;
      case "injection":
        return injectionOptions;
      case "physiology":
        return physiologyTests;
      case "dialysis":
        return dialysisOptions;
      case "pathology":
        return pathologyOptions;
      case "microbiology":
        return microbiologyOptions;
      case "endoscopy":
        return endoscopyOptions;
      case "guidance":
        return guidanceOptions;
      case "general":
        return generalOptions;
      case "rehabilitation":
        return rehabilitationOptions;
      case "transfusion":
        return transfusionOptions;
      case "surgery":
        return surgeryOptions;
      default:
        return [];
    }
  };

  const getCompletionPercentage = () => {
    const requiredFields = ["name"];
    if (newOrder.type === "prescription") {
      requiredFields.push("dosage", "frequency", "duration");
    } else if (newOrder.type === "injection") {
      requiredFields.push("dosage", "frequency");
    } else if (newOrder.type === "dialysis") {
      requiredFields.push("frequency", "duration");
    } else if (newOrder.type === "transfusion") {
      requiredFields.push("amount");
    } else if (newOrder.type === "surgery") {
      requiredFields.push("priority");
    } else if (newOrder.type === "rehabilitation") {
      requiredFields.push("frequency", "duration");
    }
    
    const filledFields = requiredFields.filter(field => 
      newOrder[field as keyof typeof newOrder]?.trim()
    ).length;
    
    return (filledFields / requiredFields.length) * 100;
  };

  return (
    <Card className="glass-effect border-0 shadow-xl bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 relative overflow-hidden transition-shadow duration-200 hover:shadow-2xl h-full flex flex-col">
      {/* 装飾的な背景 */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-green-500/10 to-transparent rounded-full -translate-y-20 translate-x-20" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full translate-y-16 -translate-x-16" />
      
      <CardHeader className="pb-4 relative z-10 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 medical-secondary rounded-xl text-white shadow-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold medical-text-secondary">オーダ入力</span>
              <div className="flex items-center space-x-2 mt-1">
                {orders.length > 0 && (
                  <Badge className="text-xs medical-secondary text-white shadow-md">
                    {orders.length}件登録済み
                  </Badge>
                )}
              </div>
            </div>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {onPrescriptionOrderOpen && (
              <Button
                onClick={onPrescriptionOrderOpen}
                className="medical-primary hover:opacity-90 text-white shadow-lg"
              >
                <Pill className="w-4 h-4 mr-2" />
                オーダー追加
              </Button>
            )}
            <Button 
              onClick={onSubmitOrders} 
              disabled={orders.length === 0}
              className="medical-primary hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Send className="w-4 h-4 mr-2" />
              オーダ確定 ({orders.length}件)
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* 登録済みオーダ簡易表示 */}
      {orders.length > 0 && (
        <div className="px-6 pb-4 relative z-10">
          <div className="flex items-center justify-center space-x-4 p-3 bg-gradient-to-r from-blue-50 via-white to-green-50 dark:from-blue-950/20 dark:via-gray-800/50 dark:to-green-950/20 rounded-xl border border-gray-200/50 dark:border-gray-700/50 overflow-x-auto">
            {Object.entries(
              orders.reduce((acc, order) => {
                // order.typeが有効なキーかチェック
                if (order.type && orderTypes[order.type]) {
                  acc[order.type] = (acc[order.type] || 0) + 1;
                }
                return acc;
              }, {} as Record<string, number>)
            ).map(([type, count]) => {
              const config = orderTypes[type as keyof typeof orderTypes];
              if (!config) return null; // configがundefinedの場合はnullを返す
              const Icon = config.icon || FileText;
              return (
                <div key={type} className="flex items-center space-x-1 flex-shrink-0">
                  <div className={`p-1.5 rounded-md ${config.color || 'bg-gray-500'} text-white shadow-sm`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <Badge variant="secondary" className="text-xs font-semibold">
                    {count}
                  </Badge>
                </div>
              );
            }).filter(Boolean)}
          </div>
        </div>
      )}

      <CardContent className="space-y-6 relative z-10 flex-1 overflow-y-auto">
        {/* 新規オーダ入力セクション */}
        <div className="space-y-4 p-4 glass-effect rounded-2xl border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-green-600" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 medical-primary rounded-lg text-white shadow-md">
                <Plus className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-semibold medical-text-secondary">新規オーダ追加</h4>
            </div>
            {getCompletionPercentage() > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">入力進捗:</span>
                <Progress value={getCompletionPercentage()} className="w-20 h-2" />
                <span className="text-xs font-medium">{Math.round(getCompletionPercentage())}%</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* オーダ種別選択 */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">オーダ種別</Label>
              <Select
                value={newOrder.type}
                onValueChange={(value) => setNewOrder({ ...newOrder, type: value as Order["type"], name: "" })}
              >
                <SelectTrigger className="focus-ring bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(orderTypes).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center space-x-3">
                        <div className={`p-1 rounded-md ${config.color} text-white`}>
                          <config.icon className="w-3 h-3 text-white" />
                        </div>
                        <span>{config.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* オーダ内容選択 */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">オーダ内容</Label>
              <Select
                value={newOrder.name}
                onValueChange={(value) => setNewOrder({ ...newOrder, name: value })}
              >
                <SelectTrigger className="focus-ring bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {getOrderOptions().map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 処方薬専用フィールド */}
          {newOrder.type === "prescription" && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl border border-purple-200/50 dark:border-purple-800/50">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-purple-700 dark:text-purple-300">用量</Label>
                <Input
                  placeholder="1錠"
                  value={newOrder.dosage}
                  onChange={(e) => setNewOrder({ ...newOrder, dosage: e.target.value })}
                  className="focus-ring bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-purple-200 dark:border-purple-700"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-purple-700 dark:text-purple-300">用法</Label>
                <Select
                  value={newOrder.frequency}
                  onValueChange={(value) => setNewOrder({ ...newOrder, frequency: value })}
                >
                  <SelectTrigger className="focus-ring bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-purple-200 dark:border-purple-700">
                    <SelectValue placeholder="選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1日1回">1日1回</SelectItem>
                    <SelectItem value="1日2回">1日2回</SelectItem>
                    <SelectItem value="1日3回">1日3回</SelectItem>
                    <SelectItem value="頓用">頓用</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-purple-700 dark:text-purple-300">期間</Label>
                <Input
                  placeholder="7日分"
                  value={newOrder.duration}
                  onChange={(e) => setNewOrder({ ...newOrder, duration: e.target.value })}
                  className="focus-ring bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-purple-200 dark:border-purple-700"
                />
              </div>
            </div>
          )}

          {/* 注射専用フィールド */}
          {newOrder.type === "injection" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-emerald-700 dark:text-emerald-300">用量・濃度</Label>
                <Input
                  placeholder="例: 10mg/2ml"
                  value={newOrder.dosage}
                  onChange={(e) => setNewOrder({ ...newOrder, dosage: e.target.value })}
                  className="focus-ring bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-emerald-200 dark:border-emerald-700"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-emerald-700 dark:text-emerald-300">投与回数</Label>
                <Select
                  value={newOrder.frequency}
                  onValueChange={(value) => setNewOrder({ ...newOrder, frequency: value })}
                >
                  <SelectTrigger className="focus-ring bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-emerald-200 dark:border-emerald-700">
                    <SelectValue placeholder="選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1回">1回</SelectItem>
                    <SelectItem value="1日1回">1日1回</SelectItem>
                    <SelectItem value="1日2回">1日2回</SelectItem>
                    <SelectItem value="1日3回">1日3回</SelectItem>
                    <SelectItem value="週1回">週1回</SelectItem>
                    <SelectItem value="必要時">必要時</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* 透析専用フィールド */}
          {newOrder.type === "dialysis" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 bg-cyan-50/50 dark:bg-cyan-950/20 rounded-xl border border-cyan-200/50 dark:border-cyan-800/50">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-cyan-700 dark:text-cyan-300">頻度</Label>
                <Select
                  value={newOrder.frequency}
                  onValueChange={(value) => setNewOrder({ ...newOrder, frequency: value })}
                >
                  <SelectTrigger className="focus-ring bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-cyan-200 dark:border-cyan-700">
                    <SelectValue placeholder="選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="週3回">週3回</SelectItem>
                    <SelectItem value="週2回">週2回</SelectItem>
                    <SelectItem value="毎日">毎日</SelectItem>
                    <SelectItem value="緊急時">緊急時</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-cyan-700 dark:text-cyan-300">時間</Label>
                <Input
                  placeholder="4時間"
                  value={newOrder.duration}
                  onChange={(e) => setNewOrder({ ...newOrder, duration: e.target.value })}
                  className="focus-ring bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-cyan-200 dark:border-cyan-700"
                />
              </div>
            </div>
          )}

          {/* リハビリ専用フィールド */}
          {newOrder.type === "rehabilitation" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 bg-lime-50/50 dark:bg-lime-950/20 rounded-xl border border-lime-200/50 dark:border-lime-800/50">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-lime-700 dark:text-lime-300">頻度</Label>
                <Select
                  value={newOrder.frequency}
                  onValueChange={(value) => setNewOrder({ ...newOrder, frequency: value })}
                >
                  <SelectTrigger className="focus-ring bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-lime-200 dark:border-lime-700">
                    <SelectValue placeholder="選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="週1回">週1回</SelectItem>
                    <SelectItem value="週2回">週2回</SelectItem>
                    <SelectItem value="週3回">週3回</SelectItem>
                    <SelectItem value="毎日">毎日</SelectItem>
                    <SelectItem value="必要時">必要時</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-lime-700 dark:text-lime-300">期間</Label>
                <Input
                  placeholder="例: 4週間"
                  value={newOrder.duration}
                  onChange={(e) => setNewOrder({ ...newOrder, duration: e.target.value })}
                  className="focus-ring bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-lime-200 dark:border-lime-700"
                />
              </div>
            </div>
          )}

          {/* 輸血専用フィールド */}
          {newOrder.type === "transfusion" && (
            <div className="space-y-3 p-3 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-200/50 dark:border-rose-800/50">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-rose-700 dark:text-rose-300">輸血量</Label>
                <Input
                  placeholder="例: 2単位、400ml"
                  value={newOrder.amount}
                  onChange={(e) => setNewOrder({ ...newOrder, amount: e.target.value })}
                  className="focus-ring bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-rose-200 dark:border-rose-700"
                />
              </div>
            </div>
          )}

          {/* 手術専用フィールド */}
          {newOrder.type === "surgery" && (
            <div className="space-y-3 p-3 bg-violet-50/50 dark:bg-violet-950/20 rounded-xl border border-violet-200/50 dark:border-violet-800/50">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700 dark:text-violet-300">緊急度</Label>
                <Select
                  value={newOrder.priority}
                  onValueChange={(value) => setNewOrder({ ...newOrder, priority: value })}
                >
                  <SelectTrigger className="focus-ring bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-violet-200 dark:border-violet-700">
                    <SelectValue placeholder="選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="緊急">緊急</SelectItem>
                    <SelectItem value="準緊急">準緊急</SelectItem>
                    <SelectItem value="待機的">待機的</SelectItem>
                    <SelectItem value="予定">予定</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* 指示・備考 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">指示・備考</Label>
            <Textarea
              placeholder="追加の指示や注意事項があれば記入してください"
              value={newOrder.instructions}
              onChange={(e) => setNewOrder({ ...newOrder, instructions: e.target.value })}
              className="focus-ring bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 min-h-20 resize-none"
            />
          </div>

          {/* オーダー追加ボタン */}
          <Button
            onClick={addOrder}
            disabled={!newOrder.name}
            className="w-full medical-secondary hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 py-3"
          >
            <Plus className="w-5 h-5" />
            <span>オーダーを追加</span>
          </Button>
        </div>

        {/* 登録済みオーダ詳細一覧 */}
        {orders.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold medical-text-primary">登録済みオーダ詳細</h4>
              <Badge variant="outline" className="text-xs">
                {orders.length}件
              </Badge>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {orders.map((order, index) => {
                const config = orderTypes[order.type];
                if (!config) return null;
                const Icon = config.icon || FileText;
                
                return (
                  <div
                    key={order.id}
                    className={`p-3 rounded-lg border ${config.bgColor} ${config.borderColor} shadow-sm hover:shadow-md transition-shadow duration-200`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <div className={`p-1.5 rounded-md ${config.color} text-white shadow-sm flex-shrink-0 mt-0.5`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge variant="secondary" className={`text-xs ${config.textColor}`}>
                              {config.label}
                            </Badge>
                            <span className="text-xs text-muted-foreground">#{index + 1}</span>
                          </div>
                          <h5 className="text-sm font-medium text-foreground mb-1 truncate" title={order.name}>
                            {order.name}
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
                            {order.dosage && (
                              <div>
                                <span className="font-medium">用量:</span> {order.dosage}
                              </div>
                            )}
                            {order.frequency && (
                              <div>
                                <span className="font-medium">用法:</span> {order.frequency}
                              </div>
                            )}
                            {order.duration && (
                              <div>
                                <span className="font-medium">期間:</span> {order.duration}
                              </div>
                            )}
                            {order.priority && (
                              <div>
                                <span className="font-medium">優先度:</span> {order.priority}
                              </div>
                            )}
                            {order.amount && (
                              <div>
                                <span className="font-medium">量:</span> {order.amount}
                              </div>
                            )}
                          </div>
                          {order.instructions && (
                            <div className="mt-2 text-xs text-muted-foreground bg-white/50 dark:bg-gray-800/50 rounded p-2">
                              <span className="font-medium">指示:</span> {order.instructions}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => removeOrder(order.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 p-1 h-auto flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}