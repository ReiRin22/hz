import { useState } from 'react';
import { User, Heart, AlertTriangle, Shield, Syringe, Wine, Baby, FileText } from 'lucide-react';

export type PatientInfoCategory = 
  | 'basic' 
  | 'history' 
  | 'allergy' 
  | 'infection' 
  | 'vaccine' 
  | 'social' 
  | 'pregnancy' 
  | 'memo';

interface PatientInfoPanelProps {
  activeCategory: PatientInfoCategory;
  onCategoryChange: (category: PatientInfoCategory) => void;
  patientGender?: 'male' | 'female' | 'other';
}

const categoryItems = [
  { 
    id: 'basic' as PatientInfoCategory, 
    label: '基本情報', 
    icon: User,
    description: '患者の基本的な情報'
  },
  { 
    id: 'history' as PatientInfoCategory, 
    label: '既往歴・家族歴', 
    icon: Heart,
    description: '過去の病歴と家族の病歴'
  },
  { 
    id: 'allergy' as PatientInfoCategory, 
    label: 'アレルギー', 
    icon: AlertTriangle,
    description: '薬物・食物アレルギー情報'
  },
  { 
    id: 'infection' as PatientInfoCategory, 
    label: '感染症', 
    icon: Shield,
    description: 'HBV、HCV、HIV等の感染症'
  },
  { 
    id: 'vaccine' as PatientInfoCategory, 
    label: 'ワクチン接種歴', 
    icon: Syringe,
    description: '予防接種の履歴'
  },
  { 
    id: 'social' as PatientInfoCategory, 
    label: '社会歴', 
    icon: Wine,
    description: '喫煙・飲酒歴'
  },
  { 
    id: 'pregnancy' as PatientInfoCategory, 
    label: '妊娠・出産歴', 
    icon: Baby,
    description: '妊娠・出産に関する履歴'
  },
  { 
    id: 'memo' as PatientInfoCategory, 
    label: 'その他メモ', 
    icon: FileText,
    description: 'その他の特記事項'
  },
];

export function PatientInfoPanel({ 
  activeCategory, 
  onCategoryChange, 
  patientGender = 'female' 
}: PatientInfoPanelProps) {
  const filteredCategories = categoryItems.filter(item => {
    // 妊娠・出産歴は女性または性別不明の場合のみ表示
    if (item.id === 'pregnancy') {
      return patientGender === 'female' || patientGender === 'other';
    }
    return true;
  });

  return (
    <div className="w-75 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-sidebar-foreground">患者情報</h2>
        <p className="text-xs text-sidebar-foreground/60 mt-1">
          カテゴリを選択してください
        </p>
      </div>
      
      <nav className="flex-1 p-2 space-y-1">
        {filteredCategories.map((item) => {
          const Icon = item.icon;
          const isActive = activeCategory === item.id;
          
          return (
            <div
              key={item.id}
              className={`
                p-3 rounded-lg cursor-pointer transition-all duration-200
                group relative
                ${isActive 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }
              `}
              onClick={() => onCategoryChange(item.id)}
            >
              <div className="flex items-center gap-3">
                <Icon className={`
                  w-4 h-4 flex-shrink-0
                  ${isActive ? 'text-primary-foreground' : 'text-sidebar-foreground/70'}
                `} />
                <div className="flex-1 min-w-0">
                  <div className={`
                    text-sm leading-none
                    ${isActive ? 'text-primary-foreground' : 'text-sidebar-foreground'}
                  `}>
                    {item.label}
                  </div>
                  <div className={`
                    text-xs mt-1 leading-tight
                    ${isActive 
                      ? 'text-primary-foreground/80' 
                      : 'text-sidebar-foreground/60'
                    }
                  `}>
                    {item.description}
                  </div>
                </div>
              </div>
              
              {/* アクティブインジケーター */}
              {isActive && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <div className="w-1 h-8 bg-primary-foreground/30 rounded-full" />
                </div>
              )}
            </div>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/60">
          患者ID: P001234567
        </div>
        <div className="text-xs text-sidebar-foreground/60 mt-1">
          最終更新: 2024/12/19 14:30
        </div>
      </div>
    </div>
  );
}
