# このファイルは削除されました
# プロジェクト整理により不要になったファイルです

// 予測テキスト生成エンジン
export const generatePredictiveText = async (
  currentText: string,
  cursorPos: number,
  userLearningData: UserLearningData,
  patientHistory: PatientHistory
): Promise<PredictiveResult[]> => {
  if (!userLearningData.preferences.predictiveTextEnabled || 
      currentText.length < userLearningData.preferences.autoCompleteThreshold) {
    return [];
  }

  const predictions: PredictiveResult[] = [];
  
  // 1. 単語レベルの予測
  const wordPredictions = await predictNextWord(currentText, cursorPos, userLearningData);
  predictions.push(...wordPredictions);
  
  // 2. フレーズレベルの予測
  const phrasePredictions = await predictNextPhrase(currentText, cursorPos, userLearningData);
  predictions.push(...phrasePredictions);
  
  // 3. 文章レベルの予測
  const sentencePredictions = await predictNextSentence(currentText, cursorPos, userLearningData);
  predictions.push(...sentencePredictions);
  
  // 4. コンテキスト分析
  const contextPredictions = await predictFromContext(currentText, cursorPos, patientHistory);
  predictions.push(...contextPredictions);
  
  // 予測結果のソートと選別
  return predictions
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, userLearningData.preferences.suggestionLimit);
};

// 次の単語予測
export const predictNextWord = async (
  text: string,
  cursorPos: number,
  userLearningData: UserLearningData
): Promise<PredictiveResult[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const beforeCursor = text.substring(0, cursorPos);
  const words = beforeCursor.split(/\s+/);
  const lastWord = words[words.length - 1] || "";
  const prevWords = words.slice(-3, -1);
  
  const predictions: PredictiveResult[] = [];
  
  // 医療用語からの予測
  medicalTerms.forEach(term => {
    if (term.term.startsWith(lastWord) && term.term !== lastWord) {
      const userBoost = term.userModifier;
      const confidence = (term.frequency / 10) * userBoost * 0.8;
      
      predictions.push({
        prediction: term.term.substring(lastWord.length),
        confidence: Math.min(0.95, confidence),
        type: 'word',
        source: 'history',
        metadata: {
          frequency: term.frequency,
          category: term.category
        }
      });
    }
  });
  
  // ユーザーの入力パターンからの予測
  Object.entries(userLearningData.inputPatterns.sequences).forEach(([sequence, frequency]) => {
    const sequenceWords = sequence.split(' ');
    const matchContext = prevWords.join(' ');
    
    if (sequence.startsWith(matchContext) && frequency > 2) {
      const nextWord = sequenceWords[prevWords.length];
      if (nextWord && nextWord.startsWith(lastWord)) {
        predictions.push({
          prediction: nextWord.substring(lastWord.length),
          confidence: Math.min(0.9, frequency / 20),
          type: 'word',
          source: 'pattern',
          metadata: {
            frequency: frequency,
            lastUsed: Date.now()
          }
        });
      }
    }
  });
  
  return predictions;
};

// フレーズ予測
export const predictNextPhrase = async (
  text: string,
  cursorPos: number,
  userLearningData: UserLearningData
): Promise<PredictiveResult[]> => {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const beforeCursor = text.substring(0, cursorPos);
  const predictions: PredictiveResult[] = [];
  
  // よく使用されるフレーズパターン
  const commonPhrases = [
    { phrase: "症状は改善傾向にあり", trigger: "症状", confidence: 0.75 },
    { phrase: "継続的な観察が必要です", trigger: "観察", confidence: 0.70 },
    { phrase: "薬物療法を開始しました", trigger: "薬物", confidence: 0.72 },
    { phrase: "検査結果は正常範囲内", trigger: "検査", confidence: 0.68 },
    { phrase: "患者の状態は安定", trigger: "患者", confidence: 0.74 },
    { phrase: "バイタルサインに異常なし", trigger: "バイタル", confidence: 0.76 }
  ];
  
  commonPhrases.forEach(({ phrase, trigger, confidence }) => {
    if (beforeCursor.toLowerCase().includes(trigger.toLowerCase())) {
      const userFreq = userLearningData.inputPatterns.phrases[phrase] || 0;
      const adjustedConfidence = confidence + (userFreq * 0.01);
      
      predictions.push({
        prediction: phrase,
        confidence: Math.min(0.9, adjustedConfidence),
        type: 'phrase',
        source: 'pattern',
        metadata: {
          frequency: userFreq,
          category: 'medical_phrase'
        }
      });
    }
  });
  
  return predictions;
};

// 文章予測
export const predictNextSentence = async (
  text: string,
  cursorPos: number,
  userLearningData: UserLearningData
): Promise<PredictiveResult[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const beforeCursor = text.substring(0, cursorPos);
  const predictions: PredictiveResult[] = [];
  
  // SOAP形式の文脈に基づく予測
  if (beforeCursor.includes("S (Subjective")) {
    predictions.push({
      prediction: "患者は主訴として",
      confidence: 0.65,
      type: 'sentence',
      source: 'context',
      metadata: { category: 'soap_subjective' }
    });
  }
  
  if (beforeCursor.includes("O (Objective")) {
    predictions.push({
      prediction: "バイタルサインは安定しており、",
      confidence: 0.70,
      type: 'sentence',
      source: 'context',
      metadata: { category: 'soap_objective' }
    });
  }
  
  if (beforeCursor.includes("A (Assessment")) {
    predictions.push({
      prediction: "診断名：",
      confidence: 0.68,
      type: 'sentence',
      source: 'context',
      metadata: { category: 'soap_assessment' }
    });
  }
  
  if (beforeCursor.includes("P (Plan")) {
    predictions.push({
      prediction: "治療方針として、",
      confidence: 0.72,
      type: 'sentence',
      source: 'context',
      metadata: { category: 'soap_plan' }
    });
  }
  
  return predictions;
};

// コンテキスト予測
export const predictFromContext = async (
  text: string,
  cursorPos: number,
  patientHistory: PatientHistory
): Promise<PredictiveResult[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const predictions: PredictiveResult[] = [];
  
  // 患者履歴に基づく予測
  if (text.includes("血圧") && patientHistory.diagnoses.includes("高血圧症")) {
    predictions.push({
      prediction: "（高血圧症の既往あり）",
      confidence: 0.80,
      type: 'phrase',
      source: 'context',
      metadata: { 
        category: 'patient_history',
        specialty: 'cardiology'
      }
    });
  }
  
  if (text.includes("血糖") && patientHistory.diagnoses.includes("糖尿病")) {
    predictions.push({
      prediction: "糖尿病の管理状況を評価",
      confidence: 0.75,
      type: 'phrase',
      source: 'context',
      metadata: { 
        category: 'patient_history',
        specialty: 'endocrinology'
      }
    });
  }
  
  // 時間帯に基づく予測
  const currentHour = new Date().getHours();
  if (currentHour >= 8 && currentHour < 12) {
    predictions.push({
      prediction: "朝の回診時",
      confidence: 0.60,
      type: 'phrase',
      source: 'context',
      metadata: { category: 'time_context' }
    });
  }
  
  return predictions;
};

// 略語検出
export const detectAbbreviations = (
  text: string,
  cursorPos: number,
  userLearningData: UserLearningData
): string[] => {
  if (!text || text.length < 2) {
    return [];
  }

  const beforeCursor = text.substring(0, cursorPos);
  const words = beforeCursor.split(/[\s\n\r\t\(\)（）,，.。;；:：\-\+\*\/=<>]+/);
  const currentWord = words[words.length - 1];

  if (!currentWord || currentWord.length < 2 || !/^[A-Za-z0-9\-]+$/.test(currentWord)) {
    return [];
  }

  const exactMatches = Object.keys(medicalAbbreviations).filter(abbr => 
    abbr.toLowerCase() === currentWord.toLowerCase()
  );
  
  const prefixMatches = Object.keys(medicalAbbreviations).filter(abbr => 
    abbr.toLowerCase().startsWith(currentWord.toLowerCase()) && 
    abbr.toLowerCase() !== currentWord.toLowerCase()
  );

  // ユーザーの使用履歴に基づいてソート
  return [...exactMatches, ...prefixMatches]
    .sort((a, b) => {
      const aData = medicalAbbreviations[a];
      const bData = medicalAbbreviations[b];
      const aScore = aData.frequency * aData.userModifier;
      const bScore = bData.frequency * bData.userModifier;
      return bScore - aScore;
    })
    .slice(0, 3);
};

// 略語展開
export const expandAbbreviations = (text: string): string => {
  let expandedText = text;
  Object.entries(medicalAbbreviations).forEach(([abbr, data]) => {
    const regex = new RegExp(`\\b${abbr}\\b`, 'g');
    expandedText = expandedText.replace(regex, `${abbr}（${data.expansion}）`);
  });
  return expandedText;
};