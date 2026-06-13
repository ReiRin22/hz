import { useState } from 'react';
import { Edit3, Save, X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';
import { Textarea } from '@/shared/components/atoms/textarea';
import { Select } from '@/shared/components/atoms/select';
import { PatientInfoCategory } from '../molecules/PatientInfoPanel';
import { Badge } from '@/shared/components/atoms/badge';

interface PatientDetailPanelProps {
  activeCategory: PatientInfoCategory;
}

interface PatientData {
  basic: {
    name: string;
    nameKana: string;
    birthDate: string;
    age: number;
    gender: string;
    phone: string;
    address: string;
    emergencyContact: string;
    bloodType: string;
    height: string;
    weight: string;
    bmi: string;
  };
  history: Array<{
    id: string;
    date: string;
    category: string;
    condition: string;
    notes: string;
  }>;
  allergy: Array<{
    id: string;
    allergen: string;
    severity: string;
    symptoms: string;
    date: string;
  }>;
  infection: Array<{
    id: string;
    virus: string;
    status: string;
    testDate: string;
    notes: string;
  }>;
  vaccine: Array<{
    id: string;
    vaccine: string;
    date: string;
    lot: string;
    location: string;
  }>;
  social: {
    smoking: {
      status: string;
      amount: string;
      duration: string;
    };
    drinking: {
      status: string;
      amount: string;
      frequency: string;
    };
    occupation: string;
    familyStructure: string;
  };
  pregnancy: Array<{
    id: string;
    pregnancyNumber: number;
    deliveryDate: string;
    deliveryMethod: string;
    complications: string;
    babyWeight: string;
  }>;
  memo: {
    generalNotes: string;
    medicalNotes: string;
    careNotes: string;
  };
}

// サンプルデータ
const samplePatientData: PatientData = {
  basic: {
    name: '山田 太郎',
    nameKana: 'ヤマダ タロウ',
    birthDate: '1980-05-15',
    age: 43,
    gender: '男性',
    phone: '090-1234-5678',
    address: '東京都渋谷区恵比寿1-2-3',
    emergencyContact: '山田 花子 (妻) 090-8765-4321',
    bloodType: 'A型 Rh+',
    height: '175',
    weight: '70',
    bmi: '22.9'
  },
  history: [
    {
      id: '1',
      date: '2020-03-15',
      category: '既往歴',
      condition: '高血圧症',
      notes: 'ARB内服中。血圧良好にコントロール'
    },
    {
      id: '2',
      date: '2018-07-22',
      category: '家族歴',
      condition: '糖尿病',
      notes: '父親が2型糖尿病'
    }
  ],
  allergy: [
    {
      id: '1',
      allergen: 'ペニシリン系抗生物質',
      severity: '重度',
      symptoms: '全身蕁麻疹、呼吸困難',
      date: '2019-08-10'
    }
  ],
  infection: [
    {
      id: '1',
      virus: 'HBs抗原',
      status: '陰性',
      testDate: '2023-04-15',
      notes: ''
    },
    {
      id: '2',
      virus: 'HCV抗体',
      status: '陰性',
      testDate: '2023-04-15',
      notes: ''
    }
  ],
  vaccine: [
    {
      id: '1',
      vaccine: 'インフルエンザ',
      date: '2023-10-15',
      lot: 'FL2023-001',
      location: '左上腕'
    }
  ],
  social: {
    smoking: {
      status: '禁煙',
      amount: '20本/日',
      duration: '10年間（2020年まで）'
    },
    drinking: {
      status: '機会飲酒',
      amount: 'ビール500ml',
      frequency: '週2-3回'
    },
    occupation: 'システムエンジニア',
    familyStructure: '妻、子供2人'
  },
  pregnancy: [],
  memo: {
    generalNotes: '几帳面な性格。服薬コンプライアンス良好。',
    medicalNotes: '血圧測定は毎朝実施。家庭血圧手帳持参。',
    careNotes: '平日は仕事が忙しく、予約時間の調整が必要。'
  }
};

export function PatientDetailPanel({ activeCategory }: PatientDetailPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [patientData, setPatientData] = useState(samplePatientData);
  const [editingData, setEditingData] = useState(samplePatientData);

  const handleEdit = () => {
    setEditingData({ ...patientData });
    setIsEditing(true);
  };

  const handleSave = () => {
    setPatientData({ ...editingData });
    setIsEditing(false);
    // ここで実際の保存処理を行う
  };

  const handleCancel = () => {
    setEditingData({ ...patientData });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string, category: keyof PatientData = 'basic') => {
    setEditingData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-foreground/80 mb-1">氏名</label>
          {isEditing ? (
            <Input 
              value={editingData.basic.name} 
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full" 
            />
          ) : (
            <div className="p-2 bg-muted rounded">{patientData.basic.name}</div>
          )}
        </div>
        <div>
          <label className="block text-sm text-foreground/80 mb-1">フリガナ</label>
          {isEditing ? (
            <Input 
              value={editingData.basic.nameKana} 
              onChange={(e) => handleInputChange('nameKana', e.target.value)}
              className="w-full" 
            />
          ) : (
            <div className="p-2 bg-muted rounded">{patientData.basic.nameKana}</div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-foreground/80 mb-1">生年月日</label>
          <div className="p-2 bg-muted rounded">{patientData.basic.birthDate}</div>
        </div>
        <div>
          <label className="block text-sm text-foreground/80 mb-1">年齢</label>
          <div className="p-2 bg-muted rounded">{patientData.basic.age}歳</div>
        </div>
        <div>
          <label className="block text-sm text-foreground/80 mb-1">性別</label>
          <div className="p-2 bg-muted rounded">{patientData.basic.gender}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-foreground/80 mb-1">電話番号</label>
          {isEditing ? (
            <Input 
              value={editingData.basic.phone} 
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full" 
            />
          ) : (
            <div className="p-2 bg-muted rounded">{patientData.basic.phone}</div>
          )}
        </div>
        <div>
          <label className="block text-sm text-foreground/80 mb-1">血液型</label>
          <div className="p-2 bg-muted rounded">{patientData.basic.bloodType}</div>
        </div>
      </div>

      <div>
        <label className="block text-sm text-foreground/80 mb-1">住所</label>
        {isEditing ? (
          <Input 
            value={editingData.basic.address} 
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="w-full" 
          />
        ) : (
          <div className="p-2 bg-muted rounded">{patientData.basic.address}</div>
        )}
      </div>

      <div>
        <label className="block text-sm text-foreground/80 mb-1">緊急連絡先</label>
        {isEditing ? (
          <Input 
            value={editingData.basic.emergencyContact} 
            onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
            className="w-full" 
          />
        ) : (
          <div className="p-2 bg-muted rounded">{patientData.basic.emergencyContact}</div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-foreground/80 mb-1">身長 (cm)</label>
          {isEditing ? (
            <Input 
              value={editingData.basic.height} 
              onChange={(e) => handleInputChange('height', e.target.value)}
              className="w-full" 
            />
          ) : (
            <div className="p-2 bg-muted rounded">{patientData.basic.height}</div>
          )}
        </div>
        <div>
          <label className="block text-sm text-foreground/80 mb-1">体重 (kg)</label>
          {isEditing ? (
            <Input 
              value={editingData.basic.weight} 
              onChange={(e) => handleInputChange('weight', e.target.value)}
              className="w-full" 
            />
          ) : (
            <div className="p-2 bg-muted rounded">{patientData.basic.weight}</div>
          )}
        </div>
        <div>
          <label className="block text-sm text-foreground/80 mb-1">BMI</label>
          <div className="p-2 bg-muted rounded">{patientData.basic.bmi}</div>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-4">
      {patientData.history.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          既往歴・家族歴が登録されていません
        </div>
      ) : (
        <div className="space-y-3">
          {patientData.history.map((item) => (
            <div key={item.id} className="p-3 border rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={item.category === '既往歴' ? 'default' : 'secondary'}>
                      {item.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{item.date}</span>
                  </div>
                  <div className="mb-1">{item.condition}</div>
                  <div className="text-sm text-muted-foreground">{item.notes}</div>
                </div>
                {isEditing && (
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {isEditing && (
        <Button variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          新しい履歴を追加
        </Button>
      )}
    </div>
  );

  const renderAllergy = () => (
    <div className="space-y-4">
      {patientData.allergy.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          アレルギー情報が登録されていません
        </div>
      ) : (
        <div className="space-y-3">
          {patientData.allergy.map((item) => (
            <div key={item.id} className="p-3 border rounded-lg bg-destructive/5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="destructive">{item.severity}</Badge>
                    <span className="text-sm text-muted-foreground">{item.date}</span>
                  </div>
                  <div className="mb-1">{item.allergen}</div>
                  <div className="text-sm text-muted-foreground">症状: {item.symptoms}</div>
                </div>
                {isEditing && (
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {isEditing && (
        <Button variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          新しいアレルギーを追加
        </Button>
      )}
    </div>
  );

  const renderInfection = () => (
    <div className="space-y-4">
      {patientData.infection.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          感染症検査結果が登録されていません
        </div>
      ) : (
        <div className="space-y-3">
          {patientData.infection.map((item) => (
            <div key={item.id} className="p-3 border rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="">{item.virus}</span>
                    <Badge variant={item.status === '陰性' ? 'secondary' : 'destructive'}>
                      {item.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{item.testDate}</span>
                  </div>
                  {item.notes && (
                    <div className="text-sm text-muted-foreground">{item.notes}</div>
                  )}
                </div>
                {isEditing && (
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {isEditing && (
        <Button variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          新しい検査結果を追加
        </Button>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeCategory) {
      case 'basic':
        return renderBasicInfo();
      case 'history':
        return renderHistory();
      case 'allergy':
        return renderAllergy();
      case 'infection':
        return renderInfection();
      case 'vaccine':
      case 'social':
      case 'pregnancy':
      case 'memo':
        return (
          <div className="text-center py-8 text-muted-foreground">
            このカテゴリの情報は準備中です
          </div>
        );
      default:
        return null;
    }
  };

  const getCategoryTitle = () => {
    const titles = {
      basic: '基本情報',
      history: '既往歴・家族歴',
      allergy: 'アレルギー',
      infection: '感染症',
      vaccine: 'ワクチン接種歴',
      social: '社会歴',
      pregnancy: '妊娠・出産歴',
      memo: 'その他メモ'
    };
    return titles[activeCategory];
  };

  return (
    <div className="flex-1 bg-background flex flex-col">
      {/* ヘッダー */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-card-foreground">{getCategoryTitle()}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              山田 太郎さんの{getCategoryTitle().toLowerCase()}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  保存
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="w-4 h-4 mr-2" />
                  キャンセル
                </Button>
              </>
            ) : (
              <Button onClick={handleEdit} variant="outline" size="sm">
                <Edit3 className="w-4 h-4 mr-2" />
                編集
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
}