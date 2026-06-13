import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

import type { 
  RegisteredSet, 
  SetType, 
  SetCategory, 
  SetSearchFilters, 
  SetUsageStats,
  SetApplyOptions,
  SetValidationResult,
  SetSuggestion
} from '../types/set-registration-types';

// ローカルストレージキー
const STORAGE_KEYS = {
  REGISTERED_SETS: 'harz_registered_sets',
  SET_USAGE_STATS: 'harz_set_usage_stats',
  USER_PREFERENCES: 'harz_set_preferences'
} as const;

// デフォルトのセットデータ
const DEFAULT_SETS: RegisteredSet[] = [
  {
    id: 'set_001',
    name: '一般内科初診',
    description: '一般内科の初診患者に対する基本的な診療セット',
    type: 'comprehensive',
    category: 'outpatient',
    comprehensive: {
      medicalRecord: {
        subjective: '主訴：\n現病歴：\n既往歴：\n家族歴：\n服薬歴：\nアレルギー：\n生活歴：',
        objective: 'バイタルサイン：\n一般状態：\n頭頸部：\n胸部：\n腹部：\n四肢：\n神経学的所見：',
        assessment: '診断：\n重症度：\n鑑別診断：',
        plan: '治療方針：\n処方：\n検査：\n生活指導：\n次回予約：'
      },
      orderSet: {
        orders: [
          { type: 'lab', name: '血液検査一般', instructions: 'CBC, 生化学' },
          { type: 'lab', name: '尿検査', instructions: '定性・沈渣' }
        ]
      }
    },
    usageCount: 45,
    lastUsed: new Date('2024-12-20'),
    createdAt: new Date('2024-01-15'),
    createdBy: 'Dr. Yamada',
    tags: ['初診', '一般内科', '基本'],
    keywords: ['初診', '内科', '基本検査'],
    learningData: {
      successRate: 0.92,
      timesSaved: 45,
      avgTimeSaving: 180
    },
    isActive: true,
    isShared: true,
    shareLevel: 'department'
  },
  {
    id: 'set_002',
    name: '高血圧フォローアップ',
    description: '高血圧患者の定期フォローアップセット',
    type: 'comprehensive',
    category: 'routine',
    comprehensive: {
      medicalRecord: {
        subjective: '症状：頭痛、めまい、動悸等の有無\n服薬状況：\n副作用：\n生活習慣：',
        objective: 'BP: /mmHg\nHR: /min\n体重: kg\n浮腫：\n心音：\n呼吸音：',
        assessment: '高血圧症\n血圧コントロール：\n心血管リスク評価：',
        plan: '降圧薬継続・調整\n生活指導継続\n次回4週間後'
      },
      orderSet: {
        orders: [
          { type: 'prescription', name: 'アムロジピン', dosage: '5mg', frequency: '1日1回', duration: '28日分' },
          { type: 'lab', name: '生化学検査', instructions: 'Na, K, Cr, eGFR' }
        ]
      }
    },
    usageCount: 78,
    lastUsed: new Date('2024-12-21'),
    createdAt: new Date('2024-02-01'),
    createdBy: 'Dr. Sato',
    tags: ['高血圧', 'フォローアップ', '生活習慣病'],
    keywords: ['高血圧', '降圧薬', '生活指導'],
    conditions: {
      patientAgeRange: { min: 40 }
    },
    learningData: {
      successRate: 0.95,
      timesSaved: 78,
      avgTimeSaving: 120
    },
    isActive: true,
    isShared: true,
    shareLevel: 'hospital'
  },
  {
    id: 'set_003',
    name: '急性胃腸炎',
    description: '急性胃腸炎の診療セット',
    type: 'comprehensive',
    category: 'emergency',
    comprehensive: {
      medicalRecord: {
        subjective: '症状：嘔吐、下痢、腹痛\n発症時期：\n随伴症状：発熱、脱水症状\n食事歴：',
        objective: 'バイタル：\n腹部所見：\n脱水所見：\n皮膚弾性：',
        assessment: '急性胃腸炎\n脱水の程度：\n重症度：',
        plan: '対症療法\n水分・電解質補正\n食事指導'
      },
      orderSet: {
        orders: [
          { type: 'prescription', name: '整腸剤', dosage: '適量', frequency: '1日3回', duration: '3日分' },
          { type: 'injection', name: '生理食塩液', amount: '500ml', instructions: '脱水補正' },
          { type: 'guidance', name: '食事指導', instructions: '消化の良い食事、水分摂取' }
        ]
      }
    },
    usageCount: 32,
    lastUsed: new Date('2024-12-19'),
    createdAt: new Date('2024-03-10'),
    createdBy: 'Dr. Tanaka',
    tags: ['急性', '胃腸炎', '脱水'],
    keywords: ['胃腸炎', '下痢', '嘔吐', '脱水'],
    learningData: {
      successRate: 0.88,
      timesSaved: 32,
      avgTimeSaving: 150
    },
    isActive: true,
    isShared: true,
    shareLevel: 'department'
  }
];

export function useSetRegistration() {
  const [registeredSets, setRegisteredSets] = useState<RegisteredSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState<SetSearchFilters>({});

  // データの初期化
  useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.REGISTERED_SETS);
        if (stored) {
          const parsedSets = JSON.parse(stored);
          // 日付文字列をDateオブジェクトに変換
          const processedSets = parsedSets.map((set: any) => ({
            ...set,
            createdAt: new Date(set.createdAt),
            updatedAt: set.updatedAt ? new Date(set.updatedAt) : undefined,
            lastUsed: set.lastUsed ? new Date(set.lastUsed) : undefined
          }));
          setRegisteredSets(processedSets);
        } else {
          // 初回起動時はデフォルトセットを設定
          setRegisteredSets(DEFAULT_SETS);
          localStorage.setItem(STORAGE_KEYS.REGISTERED_SETS, JSON.stringify(DEFAULT_SETS));
        }
      } catch (error) {
        console.error('セットデータの読み込みに失敗:', error);
        setRegisteredSets(DEFAULT_SETS);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // データの保存
  const saveToStorage = useCallback((sets: RegisteredSet[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.REGISTERED_SETS, JSON.stringify(sets));
    } catch (error) {
      console.error('セットデータの保存に失敗:', error);
      toast.error('セットデータの保存に失敗しました');
    }
  }, []);

  // セットの作成
  const createSet = useCallback((newSet: Omit<RegisteredSet, 'id' | 'createdAt' | 'usageCount' | 'learningData'>) => {
    const set: RegisteredSet = {
      ...newSet,
      id: `set_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      usageCount: 0,
      learningData: {
        successRate: 0,
        timesSaved: 0,
        avgTimeSaving: 0
      }
    };

    const updatedSets = [...registeredSets, set];
    setRegisteredSets(updatedSets);
    saveToStorage(updatedSets);
    
    toast.success(`セット「${set.name}」を作成しました`);
    return set;
  }, [registeredSets, saveToStorage]);

  // セットの更新
  const updateSet = useCallback((setId: string, updates: Partial<RegisteredSet>) => {
    const updatedSets = registeredSets.map(set => 
      set.id === setId 
        ? { ...set, ...updates, updatedAt: new Date() }
        : set
    );
    
    setRegisteredSets(updatedSets);
    saveToStorage(updatedSets);
    
    const setName = updatedSets.find(s => s.id === setId)?.name || 'セット';
    toast.success(`「${setName}」を更新しました`);
  }, [registeredSets, saveToStorage]);

  // セットの削除
  const deleteSet = useCallback((setId: string) => {
    const setToDelete = registeredSets.find(s => s.id === setId);
    const updatedSets = registeredSets.filter(set => set.id !== setId);
    
    setRegisteredSets(updatedSets);
    saveToStorage(updatedSets);
    
    toast.success(`セット「${setToDelete?.name || 'セット'}」を削除しました`);
  }, [registeredSets, saveToStorage]);

  // セットの適用（使用記録も更新）
  const applySet = useCallback((setId: string, options: SetApplyOptions = {
    overwrite: false,
    merge: true,
    confirmBeforeApply: true,
    logUsage: true
  }) => {
    const set = registeredSets.find(s => s.id === setId);
    if (!set) {
      toast.error('セットが見つかりません');
      return null;
    }

    // 使用記録を更新
    if (options.logUsage) {
      const updatedSets = registeredSets.map(s => 
        s.id === setId 
          ? { 
              ...s, 
              usageCount: s.usageCount + 1,
              lastUsed: new Date(),
              learningData: {
                ...s.learningData!,
                timesSaved: s.learningData!.timesSaved + 1
              }
            }
          : s
      );
      
      setRegisteredSets(updatedSets);
      saveToStorage(updatedSets);
    }

    toast.success(`セット「${set.name}」を適用しました`);
    return set;
  }, [registeredSets, saveToStorage]);

  // セットの検索とフィルタリング
  const getFilteredSets = useCallback(() => {
    let filtered = registeredSets.filter(set => set.isActive);

    if (searchFilters.type?.length) {
      filtered = filtered.filter(set => searchFilters.type!.includes(set.type));
    }

    if (searchFilters.category?.length) {
      filtered = filtered.filter(set => searchFilters.category!.includes(set.category));
    }

    if (searchFilters.keywords) {
      const keywords = searchFilters.keywords.toLowerCase();
      filtered = filtered.filter(set => 
        set.name.toLowerCase().includes(keywords) ||
        set.description?.toLowerCase().includes(keywords) ||
        set.keywords.some(k => k.toLowerCase().includes(keywords)) ||
        set.tags.some(t => t.toLowerCase().includes(keywords))
      );
    }

    if (searchFilters.tags?.length) {
      filtered = filtered.filter(set => 
        searchFilters.tags!.some(tag => set.tags.includes(tag))
      );
    }

    if (searchFilters.usageCountMin !== undefined) {
      filtered = filtered.filter(set => set.usageCount >= searchFilters.usageCountMin!);
    }

    if (searchFilters.lastUsedSince) {
      filtered = filtered.filter(set => 
        set.lastUsed && set.lastUsed >= searchFilters.lastUsedSince!
      );
    }

    return filtered.sort((a, b) => {
      // 使用頻度と最終使用日でソート
      const usageScore = (b.usageCount || 0) - (a.usageCount || 0);
      if (usageScore !== 0) return usageScore;
      
      const aLastUsed = a.lastUsed?.getTime() || 0;
      const bLastUsed = b.lastUsed?.getTime() || 0;
      return bLastUsed - aLastUsed;
    });
  }, [registeredSets, searchFilters]);

  // 使用統計の取得
  const getUsageStats = useCallback((): SetUsageStats => {
    const totalSets = registeredSets.length;
    const totalUsage = registeredSets.reduce((sum, set) => sum + set.usageCount, 0);
    const avgTimeSaving = registeredSets.reduce((sum, set) => 
      sum + (set.learningData?.avgTimeSaving || 0), 0
    ) / totalSets;

    const mostUsedSets = [...registeredSets]
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 5);

    const recentSets = [...registeredSets]
      .filter(set => set.lastUsed)
      .sort((a, b) => (b.lastUsed?.getTime() || 0) - (a.lastUsed?.getTime() || 0))
      .slice(0, 5);

    // カテゴリ別統計
    const categoryMap = new Map<SetCategory, { count: number; usage: number }>();
    registeredSets.forEach(set => {
      const current = categoryMap.get(set.category) || { count: 0, usage: 0 };
      categoryMap.set(set.category, {
        count: current.count + 1,
        usage: current.usage + set.usageCount
      });
    });

    const categoryStats = Array.from(categoryMap.entries()).map(([category, stats]) => ({
      category,
      count: stats.count,
      usage: stats.usage
    }));

    return {
      totalSets,
      totalUsage,
      avgTimeSaving,
      mostUsedSets,
      recentSets,
      categoryStats
    };
  }, [registeredSets]);

  // セットの推奨機能（簡易版）
  const getSuggestions = useCallback((context: {
    patientAge?: number;
    patientGender?: string;
    currentSymptoms?: string[];
    recentDiagnoses?: string[];
  }): SetSuggestion[] => {
    const suggestions: SetSuggestion[] = [];

    registeredSets.forEach(set => {
      let confidence = 0;
      const matchingElements: string[] = [];

      // 年齢条件のマッチング
      if (set.conditions?.patientAgeRange && context.patientAge) {
        const { min, max } = set.conditions.patientAgeRange;
        if ((!min || context.patientAge >= min) && (!max || context.patientAge <= max)) {
          confidence += 0.2;
          matchingElements.push('年齢条件');
        }
      }

      // キーワードマッチング
      if (context.currentSymptoms?.length) {
        const keywordMatches = context.currentSymptoms.filter(symptom =>
          set.keywords.some(keyword => 
            keyword.toLowerCase().includes(symptom.toLowerCase()) ||
            symptom.toLowerCase().includes(keyword.toLowerCase())
          )
        );
        if (keywordMatches.length > 0) {
          confidence += Math.min(keywordMatches.length * 0.3, 0.6);
          matchingElements.push(`症状マッチ: ${keywordMatches.join(', ')}`);
        }
      }

      // 使用頻度による重み付け
      if (set.usageCount > 10) {
        confidence += 0.1;
        matchingElements.push('高使用頻度');
      }

      if (confidence > 0.3) {
        suggestions.push({
          setId: set.id,
          confidence,
          reason: `信頼度 ${Math.round(confidence * 100)}%`,
          matchingElements
        });
      }
    });

    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);
  }, [registeredSets]);

  // セットのバリデーション
  const validateSet = useCallback((set: Partial<RegisteredSet>): SetValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    if (!set.name || set.name.trim().length === 0) {
      errors.push('セット名は必須です');
    }

    if (!set.type) {
      errors.push('セットタイプは必須です');
    }

    if (!set.category) {
      errors.push('セットカテゴリは必須です');
    }

    // 内容のバリデーション
    if (set.type === 'comprehensive' && set.comprehensive) {
      if (!set.comprehensive.medicalRecord && !set.comprehensive.orderSet && 
          !set.comprehensive.diagnosisSet && !set.comprehensive.vitalSigns) {
        warnings.push('包括的セットには少なくとも一つの要素が必要です');
      }
    }

    // 重複チェック
    const duplicateName = registeredSets.find(existingSet => 
      existingSet.name === set.name && existingSet.id !== set.id
    );
    if (duplicateName) {
      warnings.push('同名のセットが既に存在します');
    }

    // 改善提案
    if (!set.tags || set.tags.length === 0) {
      suggestions.push('検索性向上のためタグを追加することをお勧めします');
    }

    if (!set.description) {
      suggestions.push('セットの説明を追加すると使いやすくなります');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }, [registeredSets]);

  return {
    // データ
    registeredSets: getFilteredSets(),
    allSets: registeredSets,
    isLoading,
    
    // 検索・フィルタ
    searchFilters,
    setSearchFilters,
    
    // CRUD操作
    createSet,
    updateSet,
    deleteSet,
    applySet,
    
    // ユーティリティ
    getUsageStats,
    getSuggestions,
    validateSet,
    
    // ヘルパー
    getSetById: (id: string) => registeredSets.find(s => s.id === id),
    getSetsByCategory: (category: SetCategory) => registeredSets.filter(s => s.category === category),
    getSetsByType: (type: SetType) => registeredSets.filter(s => s.type === type)
  };
}