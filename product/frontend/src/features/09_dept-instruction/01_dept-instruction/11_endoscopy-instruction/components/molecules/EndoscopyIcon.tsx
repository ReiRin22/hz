import React from 'react';

interface EndoscopyIconProps {
  type: 'stomach' | 'colon' | 'ercp';
  className?: string;
}

export function EndoscopyIcon({ type, className = '' }: EndoscopyIconProps) {
  const getIcon = () => {
    switch (type) {
      case 'stomach':
        // 胃カメラ：内視鏡装置のソリッドアイコン
        return (
          <svg
            viewBox="0 0 48 48"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
          >
            {/* ハンドル/コントロールヘッド */}
            <rect x="20" y="4" width="8" height="6" rx="1" />
            
            {/* 星型ノブ */}
            <path d="M24 11 L25 13 L27 13 L25.5 14.5 L26 16.5 L24 15 L22 16.5 L22.5 14.5 L21 13 L23 13 Z" />
            
            {/* ストレートな縦軸 */}
            <rect x="22" y="10" width="4" height="20" rx="2" />
            
            {/* 柔軟な管（スムーズなループ） */}
            <path 
              d="M26 18 C30 18, 34 20, 38 24 C42 28, 42 32, 40 36 C38 40, 34 42, 30 42 C26 42, 22 40, 20 38 L20 36 C22 38, 26 40, 30 40 C34 40, 37 38, 39 35 C41 32, 40 28, 37 25 C34 22, 30 20, 26 20 L26 18 Z"
            />
            
            {/* 管の先端（小さな円） */}
            <circle cx="20" cy="37" r="2" />
          </svg>
        );
      
      case 'colon':
        // 大腸：同じデザイン
        return (
          <svg
            viewBox="0 0 48 48"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
          >
            {/* ハンドル/コントロールヘッド */}
            <rect x="20" y="4" width="8" height="6" rx="1" />
            
            {/* 星型ノブ */}
            <path d="M24 11 L25 13 L27 13 L25.5 14.5 L26 16.5 L24 15 L22 16.5 L22.5 14.5 L21 13 L23 13 Z" />
            
            {/* ストレートな縦軸 */}
            <rect x="22" y="10" width="4" height="20" rx="2" />
            
            {/* 柔軟な管（スムーズなループ） */}
            <path 
              d="M26 18 C30 18, 34 20, 38 24 C42 28, 42 32, 40 36 C38 40, 34 42, 30 42 C26 42, 22 40, 20 38 L20 36 C22 38, 26 40, 30 40 C34 40, 37 38, 39 35 C41 32, 40 28, 37 25 C34 22, 30 20, 26 20 L26 18 Z"
            />
            
            {/* 管の先端（小さな円） */}
            <circle cx="20" cy="37" r="2" />
          </svg>
        );
      
      case 'ercp':
        // ERCP：同じデザイン
        return (
          <svg
            viewBox="0 0 48 48"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
          >
            {/* ハンドル/コントロールヘッド */}
            <rect x="20" y="4" width="8" height="6" rx="1" />
            
            {/* 星型ノブ */}
            <path d="M24 11 L25 13 L27 13 L25.5 14.5 L26 16.5 L24 15 L22 16.5 L22.5 14.5 L21 13 L23 13 Z" />
            
            {/* ストレートな縦軸 */}
            <rect x="22" y="10" width="4" height="20" rx="2" />
            
            {/* 柔軟な管（スムーズなループ） */}
            <path 
              d="M26 18 C30 18, 34 20, 38 24 C42 28, 42 32, 40 36 C38 40, 34 42, 30 42 C26 42, 22 40, 20 38 L20 36 C22 38, 26 40, 30 40 C34 40, 37 38, 39 35 C41 32, 40 28, 37 25 C34 22, 30 20, 26 20 L26 18 Z"
            />
            
            {/* 管の先端（小さな円） */}
            <circle cx="20" cy="37" r="2" />
          </svg>
        );
      
      default:
        return null;
    }
  };

  return getIcon();
}

// 内視鏡検査の種類を判定するヘルパー関数
export function getEndoscopyType(endoscopyDetails?: string): 'stomach' | 'colon' | 'ercp' | null {
  if (!endoscopyDetails) return null;
  
  const details = endoscopyDetails.toLowerCase();
  
  if (details.includes('ercp') || details.includes('胆管')) {
    return 'ercp';
  } else if (details.includes('大腸') || details.includes('下部消化管')) {
    return 'colon';
  } else if (details.includes('上部消化管') || details.includes('胃')) {
    return 'stomach';
  }
  
  return null;
}