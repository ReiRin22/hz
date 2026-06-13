import { renderToStaticMarkup } from 'react-dom/server';
import type { ReactElement } from 'react';

/**
 * React SVG コンポーネントを SVG 文字列に変換する
 * @param component React SVG コンポーネント
 * @returns SVG 文字列
 */
export function svgComponentToString(component: ReactElement): string {
  return renderToStaticMarkup(component);
}
