import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/atoms/dialog";
import { Button } from "@/shared/components/atoms/button";
import { Input } from "@/shared/components/atoms/input";
import { Label } from "@/shared/components/atoms/label";
import { Textarea } from "@/shared/components/atoms/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/atoms/select";
import { Badge } from "@/shared/components/atoms/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/atoms/tabs";
import { Switch } from "@/shared/components/atoms/switch";
import { Alert, AlertDescription } from "@/shared/components/atoms/alert";
import { ScrollArea } from "@/shared/components/atoms/scroll-area";
import { Separator } from "@/shared/components/atoms/separator";
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Lightbulb,
  Tags,
  Settings,
  FileText,
  Pill,
  ClipboardList,
  Activity,
  Users,
  Share2
} from "lucide-react";
import { toast } from "sonner";

import type { 
  RegisteredSet, 
  SetType, 
  SetCategory,
  SetValidationResult
} from "../types/set-registration-types";

interface SetRegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingSet?: RegisteredSet | null;
  onSaveSet: (set: Omit<RegisteredSet, 'id' | 'createdAt' | 'usageCount' | 'learningData'>) => void;
  onValidateSet: (set: Partial<RegisteredSet>) => SetValidationResult;
}

const SET_TYPE_OPTIONS = [
  { value: 'medical_record', label: 'SOAP記録セット', icon: FileText, color: 'bg-blue-500' },
  { value: 'order_set', label: 'オーダーセット', icon: ClipboardList, color: 'bg-green-500' },
  { value: 'diagnosis_set', label: '病名セット', icon: Activity, color: 'bg-purple-500' },
  { value: 'template_set', label: 'テンプレートセット', icon: FileText, color: 'bg-orange-500' },
  { value: 'comprehensive', label: '包括的セット', icon: Users, color: 'bg-indigo-500' }
] as const;

const SET_CATEGORY_OPTIONS = [
  { value: 'routine', label: '日常的', description: '日常診療でよく使用' },
  { value: 'emergency', label: '救急', description: '緊急時の診療' },
  { value: 'outpatient', label: '外来', description: '外来診療専用' },
  { value: 'inpatient', label: '入院', description: '入院診療専用' },
  { value: 'specialty', label: '専門', description: '専門外来・特殊診療' },
  { value: 'custom', label: 'カスタム', description: '個人的な用途' }
] as const;

const SHARE_LEVEL_OPTIONS = [
  { value: 'private', label: '個人のみ', description: '自分だけが使用' },
  { value: 'department', label: '部署内', description: '同じ部署内で共有' },
  { value: 'hospital', label: '院内', description: '病院全体で共有' },
  { value: 'public', label: '公開', description: '他の病院とも共有' }
] as const;

export function SetRegistrationDialog({
  isOpen,
  onClose,
  editingSet,
  onSaveSet,
  onValidateSet
}: SetRegistrationDialogProps) {
  // フォーム状態
  const [formData, setFormData] = useState<Partial<RegisteredSet>>({});
  const [activeTab, setActiveTab] = useState("basic");
  const [validation, setValidation] = useState<SetValidationResult | null>(null);
  const [newTag, setNewTag] = useState("");
  const [newKeyword, setNewKeyword] = useState("");

  // 編集モードの場合、初期値を設定
  useEffect(() => {
    if (editingSet) {
      setFormData(editingSet);
    } else {
      setFormData({
        name: "",
        description: "",
        type: 'comprehensive',
        category: 'routine',
        tags: [],
        keywords: [],
        isActive: true,
        isShared: false,
        shareLevel: 'private',
        comprehensive: {
          medicalRecord: {
            subjective: "",
            objective: "",
            assessment: "",
            plan: ""
          },
          orderSet: {
            orders: []
          }
        }
      });
    }
    setActiveTab("basic");
  }, [editingSet, isOpen]);

  // バリデーション実行
  useEffect(() => {
    if (formData.name) {
      const result = onValidateSet(formData);
      setValidation(result);
    }
  }, [formData, onValidateSet]);

  // フォーム更新ヘルパー
  const updateFormData = (updates: Partial<RegisteredSet>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // タグ追加
  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      updateFormData({
        tags: [...(formData.tags || []), newTag.trim()]
      });
      setNewTag("");
    }
  };

  // タグ削除
  const removeTag = (tagToRemove: string) => {
    updateFormData({
      tags: formData.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  // キーワード追加
  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords?.includes(newKeyword.trim())) {
      updateFormData({
        keywords: [...(formData.keywords || []), newKeyword.trim()]
      });
      setNewKeyword("");
    }
  };

  // キーワード削除
  const removeKeyword = (keywordToRemove: string) => {
    updateFormData({
      keywords: formData.keywords?.filter(keyword => keyword !== keywordToRemove) || []
    });
  };

  // オーダー追加
  const addOrder = () => {
    if (formData.comprehensive?.orderSet) {
      const newOrder = {
        type: 'prescription',
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      };
      
      updateFormData({
        comprehensive: {
          ...formData.comprehensive,
          orderSet: {
            orders: [...formData.comprehensive.orderSet.orders, newOrder]
          }
        }
      });
    }
  };

  // オーダー削除
  const removeOrder = (index: number) => {
    if (formData.comprehensive?.orderSet) {
      const updatedOrders = formData.comprehensive.orderSet.orders.filter((_, i) => i !== index);
      updateFormData({
        comprehensive: {
          ...formData.comprehensive,
          orderSet: {
            orders: updatedOrders
          }
        }
      });
    }
  };

  // オーダー更新
  const updateOrder = (index: number, orderUpdates: any) => {
    if (formData.comprehensive?.orderSet) {
      const updatedOrders = formData.comprehensive.orderSet.orders.map((order, i) =>
        i === index ? { ...order, ...orderUpdates } : order
      );
      updateFormData({
        comprehensive: {
          ...formData.comprehensive,
          orderSet: {
            orders: updatedOrders
          }
        }
      });
    }
  };

  // 保存処理
  const handleSave = () => {
    if (!validation?.isValid) {
      toast.error('入力内容を確認してください');
      return;
    }

    try {
      onSaveSet({
        name: formData.name!,
        description: formData.description,
        type: formData.type!,
        category: formData.category!,
        comprehensive: formData.comprehensive,
        medicalRecord: formData.medicalRecord,
        orderSet: formData.orderSet,
        diagnosisSet: formData.diagnosisSet,
        vitalSigns: formData.vitalSigns,
        tags: formData.tags || [],
        keywords: formData.keywords || [],
        conditions: formData.conditions,
        isActive: formData.isActive ?? true,
        isShared: formData.isShared ?? false,
        shareLevel: formData.shareLevel || 'private',
        createdBy: 'Current User', // 実際の実装では現在のユーザーIDを使用
        updatedBy: editingSet ? 'Current User' : undefined
      });
      
      onClose();
      toast.success(`セット「${formData.name}」を${editingSet ? '更新' : '作成'}しました`);
    } catch (error) {
      toast.error('セットの保存に失敗しました');
    }
  };

  const selectedTypeOption = SET_TYPE_OPTIONS.find(opt => opt.value === formData.type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            {selectedTypeOption && (
              <div className={`p-2 rounded-lg ${selectedTypeOption.color} text-white`}>
                <selectedTypeOption.icon className="w-5 h-5" />
              </div>
            )}
            <span>
              {editingSet ? 'セット編集' : 'セット新規作成'} - {selectedTypeOption?.label}
            </span>
          </DialogTitle>
          <DialogDescription>
            {editingSet 
              ? `既存のセット「${editingSet.name}」を編集しています。設定を変更してセットを更新できます。`
              : 'よく使用する診療行為、所見、病名などを登録して、診療効率を向上させるセットを作成しましょう。'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="content">セット内容</TabsTrigger>
              <TabsTrigger value="metadata">メタデータ</TabsTrigger>
              <TabsTrigger value="settings">設定</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden mt-4">
              <ScrollArea className="h-[60vh]">
                <TabsContent value="basic" className="space-y-6 px-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="setName">セット名 *</Label>
                      <Input
                        id="setName"
                        value={formData.name || ""}
                        onChange={(e) => updateFormData({ name: e.target.value })}
                        placeholder="わかりやすいセット名を入力"
                        className="focus-ring"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="setType">セットタイプ *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value: SetType) => updateFormData({ type: value })}
                      >
                        <SelectTrigger className="focus-ring">
                          <SelectValue placeholder="セットタイプを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          {SET_TYPE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center space-x-2">
                                <option.icon className="w-4 h-4" />
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="setCategory">カテゴリ *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value: SetCategory) => updateFormData({ category: value })}
                      >
                        <SelectTrigger className="focus-ring">
                          <SelectValue placeholder="カテゴリを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          {SET_CATEGORY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex flex-col">
                                <span className="font-medium">{option.label}</span>
                                <span className="text-xs text-muted-foreground">{option.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>セット状態</Label>
                      <div className="flex items-center space-x-2 h-10">
                        <Switch
                          checked={formData.isActive ?? true}
                          onCheckedChange={(checked) => updateFormData({ isActive: checked })}
                        />
                        <span className="text-sm">
                          {formData.isActive ? '有効' : '無効'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="setDescription">説明</Label>
                    <Textarea
                      id="setDescription"
                      value={formData.description || ""}
                      onChange={(e) => updateFormData({ description: e.target.value })}
                      placeholder="セットの用途や使用場面を説明してください"
                      rows={3}
                      className="focus-ring"
                    />
                  </div>

                  {/* バリデーション結果表示 */}
                  {validation && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center space-x-2">
                          {validation.isValid ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-green-600">入力完了</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                              <span className="text-red-600">入力エラー</span>
                            </>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {validation.errors.length > 0 && (
                          <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              <div className="space-y-1">
                                {validation.errors.map((error, index) => (
                                  <div key={index} className="text-red-600">• {error}</div>
                                ))}
                              </div>
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        {validation.warnings.length > 0 && (
                          <Alert>
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                              <div className="space-y-1">
                                {validation.warnings.map((warning, index) => (
                                  <div key={index} className="text-amber-600">• {warning}</div>
                                ))}
                              </div>
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        {validation.suggestions.length > 0 && (
                          <Alert>
                            <Lightbulb className="h-4 w-4" />
                            <AlertDescription>
                              <div className="space-y-1">
                                {validation.suggestions.map((suggestion, index) => (
                                  <div key={index} className="text-blue-600">• {suggestion}</div>
                                ))}
                              </div>
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="content" className="space-y-6 px-1">
                  {formData.type === 'comprehensive' && (
                    <div className="space-y-6">
                      {/* SOAP記録セクション */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <FileText className="w-5 h-5 medical-text-primary" />
                            <span>SOAP記録テンプレート</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>S (主観的情報)</Label>
                              <Textarea
                                value={formData.comprehensive?.medicalRecord?.subjective || ""}
                                onChange={(e) => updateFormData({
                                  comprehensive: {
                                    ...formData.comprehensive,
                                    medicalRecord: {
                                      ...formData.comprehensive?.medicalRecord,
                                      subjective: e.target.value
                                    }
                                  }
                                })}
                                placeholder="患者の訴えのテンプレート"
                                rows={4}
                                className="focus-ring"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>O (客観的情報)</Label>
                              <Textarea
                                value={formData.comprehensive?.medicalRecord?.objective || ""}
                                onChange={(e) => updateFormData({
                                  comprehensive: {
                                    ...formData.comprehensive,
                                    medicalRecord: {
                                      ...formData.comprehensive?.medicalRecord,
                                      objective: e.target.value
                                    }
                                  }
                                })}
                                placeholder="身体所見・検査結果のテンプレート"
                                rows={4}
                                className="focus-ring"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>A (評価・診断)</Label>
                              <Textarea
                                value={formData.comprehensive?.medicalRecord?.assessment || ""}
                                onChange={(e) => updateFormData({
                                  comprehensive: {
                                    ...formData.comprehensive,
                                    medicalRecord: {
                                      ...formData.comprehensive?.medicalRecord,
                                      assessment: e.target.value
                                    }
                                  }
                                })}
                                placeholder="診断・評価のテンプレート"
                                rows={4}
                                className="focus-ring"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>P (計画)</Label>
                              <Textarea
                                value={formData.comprehensive?.medicalRecord?.plan || ""}
                                onChange={(e) => updateFormData({
                                  comprehensive: {
                                    ...formData.comprehensive,
                                    medicalRecord: {
                                      ...formData.comprehensive?.medicalRecord,
                                      plan: e.target.value
                                    }
                                  }
                                })}
                                placeholder="治療計画のテンプレート"
                                rows={4}
                                className="focus-ring"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* オーダーセクション */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <ClipboardList className="w-5 h-5 medical-text-secondary" />
                              <span>オーダーセット</span>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addOrder}
                              className="flex items-center space-x-1"
                            >
                              <Plus className="w-4 h-4" />
                              <span>オーダー追加</span>
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {formData.comprehensive?.orderSet?.orders.map((order, index) => (
                              <Card key={index} className="border-l-4 border-l-green-500">
                                <CardContent className="pt-4">
                                  <div className="flex items-start justify-between mb-3">
                                    <h4 className="font-medium">オーダー {index + 1}</h4>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeOrder(index)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                      <Label>種類</Label>
                                      <Select
                                        value={order.type}
                                        onValueChange={(value) => updateOrder(index, { type: value })}
                                      >
                                        <SelectTrigger className="focus-ring">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="prescription">処方</SelectItem>
                                          <SelectItem value="injection">注射</SelectItem>
                                          <SelectItem value="lab">検査</SelectItem>
                                          <SelectItem value="procedure">処置</SelectItem>
                                          <SelectItem value="guidance">指導</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label>名称</Label>
                                      <Input
                                        value={order.name}
                                        onChange={(e) => updateOrder(index, { name: e.target.value })}
                                        placeholder="オーダー名"
                                        className="focus-ring"
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-3 gap-3 mt-3">
                                    <div className="space-y-2">
                                      <Label>用量・量</Label>
                                      <Input
                                        value={order.dosage || order.amount || ""}
                                        onChange={(e) => updateOrder(index, { dosage: e.target.value, amount: e.target.value })}
                                        placeholder="用量"
                                        className="focus-ring"
                                      />
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label>頻度</Label>
                                      <Input
                                        value={order.frequency || ""}
                                        onChange={(e) => updateOrder(index, { frequency: e.target.value })}
                                        placeholder="頻度"
                                        className="focus-ring"
                                      />
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label>期間</Label>
                                      <Input
                                        value={order.duration || ""}
                                        onChange={(e) => updateOrder(index, { duration: e.target.value })}
                                        placeholder="期間"
                                        className="focus-ring"
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2 mt-3">
                                    <Label>指示・注意事項</Label>
                                    <Textarea
                                      value={order.instructions || ""}
                                      onChange={(e) => updateOrder(index, { instructions: e.target.value })}
                                      placeholder="詳細な指示や注意事項"
                                      rows={2}
                                      className="focus-ring"
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                            
                            {(!formData.comprehensive?.orderSet?.orders || formData.comprehensive.orderSet.orders.length === 0) && (
                              <div className="text-center py-8 text-muted-foreground">
                                <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>まだオーダーが追加されていません</p>
                                <p className="text-sm">「オーダー追加」ボタンでオーダーを追加してください</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="metadata" className="space-y-6 px-1">
                  {/* タグ */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Tags className="w-5 h-5 text-blue-600" />
                        <span>タグ</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex space-x-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="タグを入力"
                          className="focus-ring"
                          onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        />
                        <Button type="button" onClick={addTag} variant="outline">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {formData.tags?.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center space-x-1"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* キーワード */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Lightbulb className="w-5 h-5 text-orange-600" />
                        <span>検索キーワード</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex space-x-2">
                        <Input
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          placeholder="検索キーワードを入力"
                          className="focus-ring"
                          onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                        />
                        <Button type="button" onClick={addKeyword} variant="outline">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {formData.keywords?.map((keyword, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="flex items-center space-x-1"
                          >
                            <span>{keyword}</span>
                            <button
                              type="button"
                              onClick={() => removeKeyword(keyword)}
                              className="hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6 px-1">
                  {/* 共有設定 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Share2 className="w-5 h-5 text-green-600" />
                        <span>共有設定</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={formData.isShared ?? false}
                          onCheckedChange={(checked) => updateFormData({ isShared: checked })}
                        />
                        <Label>他のユーザーと共有する</Label>
                      </div>
                      
                      {formData.isShared && (
                        <div className="space-y-2">
                          <Label>共有レベル</Label>
                          <Select
                            value={formData.shareLevel}
                            onValueChange={(value: any) => updateFormData({ shareLevel: value })}
                          >
                            <SelectTrigger className="focus-ring">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {SHARE_LEVEL_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{option.label}</span>
                                    <span className="text-xs text-muted-foreground">{option.description}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* 適用条件 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Settings className="w-5 h-5 text-purple-600" />
                        <span>適用条件（オプション）</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>患者年齢範囲</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              placeholder="最低年齢"
                              value={formData.conditions?.patientAgeRange?.min || ""}
                              onChange={(e) => updateFormData({
                                conditions: {
                                  ...formData.conditions,
                                  patientAgeRange: {
                                    ...formData.conditions?.patientAgeRange,
                                    min: e.target.value ? parseInt(e.target.value) : undefined
                                  }
                                }
                              })}
                              className="focus-ring"
                            />
                            <span>〜</span>
                            <Input
                              type="number"
                              placeholder="最高年齢"
                              value={formData.conditions?.patientAgeRange?.max || ""}
                              onChange={(e) => updateFormData({
                                conditions: {
                                  ...formData.conditions,
                                  patientAgeRange: {
                                    ...formData.conditions?.patientAgeRange,
                                    max: e.target.value ? parseInt(e.target.value) : undefined
                                  }
                                }
                              })}
                              className="focus-ring"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>患者性別</Label>
                          <Select
                            value={formData.conditions?.patientGender || ""}
                            onValueChange={(value: any) => updateFormData({
                              conditions: {
                                ...formData.conditions,
                                patientGender: value || undefined
                              }
                            })}
                          >
                            <SelectTrigger className="focus-ring">
                              <SelectValue placeholder="指定なし" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">指定なし</SelectItem>
                              <SelectItem value="male">男性</SelectItem>
                              <SelectItem value="female">女性</SelectItem>
                              <SelectItem value="other">その他</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>診療科</Label>
                          <Input
                            value={formData.conditions?.department || ""}
                            onChange={(e) => updateFormData({
                              conditions: {
                                ...formData.conditions,
                                department: e.target.value || undefined
                              }
                            })}
                            placeholder="例: 内科、外科"
                            className="focus-ring"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>専門分野</Label>
                          <Input
                            value={formData.conditions?.specialty || ""}
                            onChange={(e) => updateFormData({
                              conditions: {
                                ...formData.conditions,
                                specialty: e.target.value || undefined
                              }
                            })}
                            placeholder="例: 循環器、消化器"
                            className="focus-ring"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </ScrollArea>
            </div>
          </Tabs>
        </div>

        <Separator />

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            {validation?.isValid ? (
              <div className="flex items-center space-x-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>保存可能</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-red-600">
                <AlertTriangle className="w-4 h-4" />
                <span>入力を完了してください</span>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!validation?.isValid}
              className="medical-primary hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingSet ? '更新' : '作成'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}