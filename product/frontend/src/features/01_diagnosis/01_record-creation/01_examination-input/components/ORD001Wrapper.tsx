"use client";
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const ORD001Page = dynamic(() => import('../../../../05_order/01_prescription-order/01_order-setting/ORD001/ORD001.tsx'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-neutral-600">オーダー画面を読み込み中...</p>
      </div>
    </div>
  )
});

const ETC004Page = dynamic(() => import('@/shared/components/organisms/left-sidemenu/ETC004'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-neutral-600">オーダー入力画面を読み込み中...</p>
      </div>
    </div>
  )
});

type ViewType = 'chart' | 'order' | 'prescription' | 'injection' | 'lab' | 'treatment' | 'guidance' | 'physiology' | 'endoscopy' | 'imaging' | 'pathology' | 'bacteriology' | 'general' | 'composite' | 'meal' | 'rehabilitation' | 'transfusion' | 'surgery' | 'dialysis' | 'admission' | 'discharge' | 'transfer' | 'nursingCare' | 'results' | 'external-info' | 'consultation' | 'patient' | 'document' | 'appointment';

interface ORD001WrapperProps {
  currentView: ViewType;
}

export function ORD001Wrapper({ currentView }: ORD001WrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // マウント検知
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // ビューが変わったときにORD001内部のボタンをシミュレートクリック
  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const clickMenuButton = (retryCount = 0) => {
      if (!containerRef.current || retryCount > 10) return;

      // ORD001のGlobalMenuボタンを見つけてクリック
      const viewMapping: Record<ViewType, string> = {
        'chart': 'カルテ',
        'order': 'オーダー',
        'prescription': 'オーダー',
        'injection': 'オーダー',
        'lab': 'オーダー',
        'treatment': 'オーダー',
        'guidance': 'オーダー',
        'physiology': 'オーダー',
        'endoscopy': 'オーダー',
        'imaging': 'オーダー',
        'pathology': 'オーダー',
        'bacteriology': 'オーダー',
        'general': 'オーダー',
        'composite': 'オーダー',
        'meal': 'オーダー',
        'rehabilitation': 'オーダー',
        'transfusion': 'オーダー',
        'surgery': 'オーダー',
        'dialysis': 'オーダー',
        'admission': 'オーダー',
        'discharge': 'オーダー',
        'transfer': 'オーダー',
        'nursingCare': 'オーダー',
        'results': '検査結果',
        'external-info': '他院情報',
        'consultation': '他科依頼',
        'patient': '患者情報',
        'document': '文書',
        'appointment': '予約'
      };

      const targetLabel = viewMapping[currentView];
      if (!targetLabel) return;

      // GlobalMenuのボタンを検索（より具体的なセレクタ）
      // ORD001のGlobalMenuは特定のクラス構造を持つ
      const allElements = containerRef.current.querySelectorAll(
        'div[class*="cursor-pointer"], button, div[class*="rounded-lg"][class*="transition-colors"]'
      );
      let clicked = false;

      for (const element of Array.from(allElements)) {
        const text = element.textContent?.trim();
        // ラベルの完全一致または部分一致でボタンを探す
        if (text === targetLabel ||
            (text && text.includes(targetLabel) && text.length < targetLabel.length + 10)) {
          // 親要素がmx-2クラスを持つ場合、それはGlobalMenuのボタン
          const parent = element.closest('div[class*="mx-2"]');
          if (parent || element.classList.contains('mx-2')) {
            (element as HTMLElement).click();
            clicked = true;
            console.log(`Clicked menu button: ${targetLabel} (found in GlobalMenu)`);
            break;
          }
        }
      }

      // ボタンが見つからない場合はリトライ
      if (!clicked) {
        if (retryCount === 0) {
          console.log(`Menu button "${targetLabel}" not found, retrying...`);
        }
        if (retryCount < 10) {
          setTimeout(() => clickMenuButton(retryCount + 1), 200);
        } else {
          console.warn(`Failed to find menu button "${targetLabel}" after ${retryCount} retries`);
        }
        return;
      }

      // オーダーのサブメニューをクリック
      if (currentView === 'prescription' || currentView === 'injection' || currentView === 'lab' ||
          currentView === 'treatment' || currentView === 'guidance' || currentView === 'physiology' ||
          currentView === 'endoscopy' || currentView === 'imaging' || currentView === 'pathology' ||
          currentView === 'bacteriology' || currentView === 'general' || currentView === 'composite' ||
          currentView === 'meal' || currentView === 'rehabilitation' || currentView === 'transfusion' ||
          currentView === 'surgery' || currentView === 'dialysis' || currentView === 'admission' ||
          currentView === 'discharge' || currentView === 'transfer' || currentView === 'nursingCare') {
        setTimeout(() => {
          const clickSubMenu = (subRetryCount = 0) => {
            if (!containerRef.current || subRetryCount > 5) return;

            const subMenuLabels: Record<string, string> = {
              'prescription': '処方オーダー',
              'injection': '注射オーダー',
              'lab': '検体オーダー',
              'treatment': '処置オーダー',
              'guidance': '指導オーダー',
              'physiology': '生理検査オーダー',
              'endoscopy': '内視鏡検査オーダー',
              'imaging': '画像検査オーダー',
              'pathology': '病理検査オーダー',
              'bacteriology': '細菌検査オーダー',
              'general': '汎用オーダー',
              'composite': '複合オーダー',
              'meal': '食事オーダー',
              'rehabilitation': 'リハビリオーダー',
              'transfusion': '輸血オーダー',
              'surgery': '手術オーダー',
              'dialysis': '透析オーダー',
              'admission': '入院オーダー',
              'discharge': '退院オーダー',
              'transfer': '転棟転科転室オーダー',
              'nursingCare': '看護ケアオーダー'
            };

            const subLabel = subMenuLabels[currentView];
            // サブメニューは bg-sidebar-accent の中にある
            const subElements = containerRef.current?.querySelectorAll(
              'div[class*="bg-sidebar-accent"] div, div[class*="bg-sidebar-accent"] button'
            );

            let subClicked = false;
            if (subElements) {
              for (const element of Array.from(subElements)) {
                const text = element.textContent?.trim();
                // 「処方オーダー」または「処方」でマッチ
                if (text === subLabel || text === subLabel.replace('オーダー', '') || text?.includes(subLabel.replace('オーダー', ''))) {
                  (element as HTMLElement).click();
                  subClicked = true;
                  console.log(`Clicked submenu button: ${text}`);
                  break;
                }
              }
            }

            // サブメニューが見つからない場合はリトライ
            if (!subClicked) {
              setTimeout(() => clickSubMenu(subRetryCount + 1), 200);
            }
          };

          clickSubMenu();
        }, 500);
      }
    };

    const timer = setTimeout(() => {
      clickMenuButton();
    }, 100);

    return () => clearTimeout(timer);
  }, [currentView, mounted]);

  // オーダービューかどうかを判定
  const isOrderView = currentView === 'prescription' || currentView === 'injection' || currentView === 'lab' ||
    currentView === 'treatment' || currentView === 'guidance' || currentView === 'physiology' ||
    currentView === 'endoscopy' || currentView === 'imaging' || currentView === 'pathology' ||
    currentView === 'bacteriology' || currentView === 'general' || currentView === 'composite' ||
    currentView === 'meal' || currentView === 'rehabilitation' || currentView === 'transfusion' ||
    currentView === 'surgery' || currentView === 'dialysis' || currentView === 'admission' ||
    currentView === 'discharge' || currentView === 'transfer' || currentView === 'nursingCare';

  return (
    <div ref={containerRef} className="ord001-embedded-container h-full w-full overflow-hidden">
      <style>{`
        /* ORD001のGlobalMenuとSystemMenuを非表示にする */
        .ord001-embedded-container .w-25,
        .ord001-embedded-container .w-20 {
          display: none !important;
        }
        /* ORD001のflex-1要素を全幅に */
        .ord001-embedded-container .flex-1 {
          width: 100% !important;
        }
      `}</style>
      {isOrderView ? <ETC004Page /> : <ORD001Page />}
    </div>
  );
}
