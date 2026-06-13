import { useRef, useEffect, forwardRef, useImperativeHandle, useCallback, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onActiveFormatsChange?: (formats: Set<string>) => void;
}

export interface RichTextEditorRef {
  getEditor: () => HTMLDivElement | null;
  focus: () => void;
  applyFormat: (format: string) => void;
  getActiveFormats: () => Set<string>;
  insertText: (text: string) => void;
  insertSchema: (schemaId: number) => void;
}

export const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ value, onChange, placeholder, disabled, className, onActiveFormatsChange }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const isUpdatingRef = useRef(false);
    const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
    const activeFormatsRef = useRef<Set<string>>(new Set()); // 最新の装飾状態を常に参照できるようにする
    const isComposingRef = useRef(false); // IME入力中かどうかを追跡
    const compositionStartPosRef = useRef<{ node: Node; offset: number } | null>(null); // IME開始位置
    const draggedSchemaRef = useRef<HTMLElement | null>(null); // ドラッグ中のシェーマブロック
    const dropIndicatorRef = useRef<HTMLElement | null>(null); // ドロップ位置インジケーター

    // マークアップをHTMLに変換
    const markupToHtml = (text: string): string => {
      if (!text) return "";
      
      let html = text;
      
      // シェーマ: [シェーマ:schema_123456] -> 画像表示
      html = html.replace(/\[シェーマ:schema_(\d+)\]/g, (match, schemaId) => {
        try {
          const imageData = localStorage.getItem(`schema_${schemaId}`);
          if (imageData) {
            return `<div class="schema-block my-4 p-2 border-2 border-blue-300 dark:border-blue-700 rounded-lg bg-blue-50 dark:bg-blue-950/30 inline-block cursor-move hover:border-blue-500 hover:shadow-lg transition-all" data-schema-id="${schemaId}" contenteditable="false" draggable="true"><img src="${imageData}" alt="シェーマ" class="max-w-full h-auto rounded pointer-events-none" style="max-height: 400px;" /><div class="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center pointer-events-none">シェーマ (ID: ${schemaId})</div></div>`;
          }
        } catch (error) {
          console.error('シェーマ読み込みエラー:', error);
        }
        return match;
      });
      
      // 太字: **text** -> <strong>text</strong>
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // 下線: __text__ -> <u>text</u>
      html = html.replace(/__(.*?)__/g, '<u class="underline">$1</u>');
      
      // 赤マーカー: [赤]text[/赤] -> <mark class="bg-red-200">text</mark>
      html = html.replace(/\[赤\](.*?)\[\/赤\]/g, '<mark class="bg-red-200 dark:bg-red-900/50">$1</mark>');
      
      // 黄マーカー: [黄]text[/黄] -> <mark class="bg-yellow-200">text</mark>
      html = html.replace(/\[黄\](.*?)\[\/黄\]/g, '<mark class="bg-yellow-200 dark:bg-yellow-900/50">$1</mark>');
      
      // 見出し: ## text -> <h3>text</h3>
      html = html.replace(/^## (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>');
      
      // 箇条書き: - text -> <li>text</li>
      const lines = html.split('\n');
      let inList = false;
      const processedLines: string[] = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim().startsWith('- ')) {
          if (!inList) {
            processedLines.push('<ul class="list-disc list-inside my-2">');
            inList = true;
          }
          processedLines.push(`<li>${line.trim().substring(2)}</li>`);
        } else {
          if (inList) {
            processedLines.push('</ul>');
            inList = false;
          }
          processedLines.push(line);
        }
      }
      
      if (inList) {
        processedLines.push('</ul>');
      }
      
      html = processedLines.join('\n');
      
      // 改行を<br>に変換（ただしタグ内の改行は除く）
      html = html.replace(/\n/g, '<br>');
      
      return html;
    };

    // HTMLをマークアップに変換
    const htmlToMarkup = (html: string): string => {
      if (!html) return "";
      
      let text = html;
      
      // シェーマブロック: <div class="schema-block" data-schema-id="123">...</div> -> [シェーマ:schema_123]
      text = text.replace(/<div[^>]*class="[^"]*schema-block[^"]*"[^>]*data-schema-id="(\d+)"[^>]*>.*?<\/div>/gi, '[シェーマ:schema_$1]');
      
      // <br>を改行に変換
      text = text.replace(/<br\s*\/?>/gi, '\n');
      
      // 箇条書き
      text = text.replace(/<ul[^>]*>/gi, '');
      text = text.replace(/<\/ul>/gi, '');
      text = text.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
      
      // 見出し
      text = text.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '## $1');
      
      // 太字
      text = text.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
      text = text.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
      
      // 下線
      text = text.replace(/<u[^>]*>(.*?)<\/u>/gi, '__$1__');
      
      // マーカー
      text = text.replace(/<mark class="bg-red-200[^"]*">(.*?)<\/mark>/gi, '[赤]$1[/赤]');
      text = text.replace(/<mark class="bg-yellow-200[^"]*">(.*?)<\/mark>/gi, '[黄]$1[/黄]');
      
      // その他のHTMLタグを削除
      text = text.replace(/<[^>]+>/g, '');
      
      // HTML実体参照をデコード
      text = text.replace(/&lt;/g, '<');
      text = text.replace(/&gt;/g, '>');
      text = text.replace(/&amp;/g, '&');
      text = text.replace(/&nbsp;/g, ' ');
      
      return text;
    };

    // 入力時の処理
    const notifyChange = () => {
      if (!editorRef.current || isUpdatingRef.current) return;
      
      const html = editorRef.current.innerHTML;
      const markup = htmlToMarkup(html);
      onChange(markup);
    };

    // カーソル位置の装飾状態を検出
    const updateActiveFormats = useCallback(() => {
      if (!editorRef.current) return;

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      
      // テキストが選択されている場合のみ装飾状態を更新
      // 選択されていない場合（ボタンでトグルした状態）は現在の状態を維持
      if (!range.collapsed) {
        let node: Node | null = range.startContainer;

        const formats = new Set<string>();

        // 現在のノードから親ノードを辿って装飾を検出
        while (node && node !== editorRef.current) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            
            if (element.tagName === 'STRONG' || element.tagName === 'B') {
              formats.add('bold');
            }
            if (element.tagName === 'U') {
              formats.add('underline');
            }
            if (element.tagName === 'MARK') {
              if (element.classList.contains('bg-red-200')) {
                formats.add('red');
              }
              if (element.classList.contains('bg-yellow-200')) {
                formats.add('yellow');
              }
            }
            if (element.tagName === 'H3') {
              formats.add('heading');
            }
            if (element.tagName === 'LI') {
              formats.add('list');
            }
          }
          node = node.parentNode;
        }

        setActiveFormats(formats);
        onActiveFormatsChange?.(formats);
        activeFormatsRef.current = formats; // 最新の装飾状態を保存
      }
    }, [onActiveFormatsChange]);

    // 装飾を適用（トグル方式）
    const handleFormat = (format: string) => {
      if (!editorRef.current || disabled) return;

      editorRef.current.focus();
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const selectedText = range.toString();

      // テキストが選択されている場合は、選択範囲に装飾を適用/解除
      if (selectedText) {
        // 選択範囲の親要素をチェックして、すでに装飾が適用されているか確認
        let node: Node | null = range.commonAncestorContainer;
        let isAlreadyFormatted = false;
        let formattedElement: HTMLElement | null = null;

        // 現在のノードから親ノードを辿って装飾を検出
        while (node && node !== editorRef.current) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            
            switch (format) {
              case 'bold':
                if (element.tagName === 'STRONG' || element.tagName === 'B') {
                  isAlreadyFormatted = true;
                  formattedElement = element;
                }
                break;
              case 'underline':
                if (element.tagName === 'U') {
                  isAlreadyFormatted = true;
                  formattedElement = element;
                }
                break;
              case 'red':
                if (element.tagName === 'MARK' && element.classList.contains('bg-red-200')) {
                  isAlreadyFormatted = true;
                  formattedElement = element;
                }
                break;
              case 'yellow':
                if (element.tagName === 'MARK' && element.classList.contains('bg-yellow-200')) {
                  isAlreadyFormatted = true;
                  formattedElement = element;
                }
                break;
              case 'heading':
                if (element.tagName === 'H3') {
                  isAlreadyFormatted = true;
                  formattedElement = element;
                }
                break;
              case 'list':
                if (element.tagName === 'LI') {
                  isAlreadyFormatted = true;
                  formattedElement = element;
                }
                break;
            }

            if (isAlreadyFormatted) break;
          }
          node = node.parentNode;
        }

        if (isAlreadyFormatted && formattedElement) {
          // 装飾を解除：装飾タグの中身をテキストノードに置き換え
          const textNode = document.createTextNode(formattedElement.textContent || '');
          formattedElement.parentNode?.replaceChild(textNode, formattedElement);
          
          // カーソル位置を維持
          const newRange = document.createRange();
          newRange.setStart(textNode, 0);
          newRange.setEnd(textNode, textNode.textContent?.length || 0);
          selection.removeAllRanges();
          selection.addRange(newRange);
        } else {
          // 装飾を適用：新しい装飾タグで囲む
          let newNode: Node;
          
          switch (format) {
            case 'bold': {
              const strong = document.createElement('strong');
              strong.textContent = selectedText;
              newNode = strong;
              break;
            }
            case 'underline': {
              const u = document.createElement('u');
              u.className = 'underline';
              u.textContent = selectedText;
              newNode = u;
              break;
            }
            case 'red': {
              const mark = document.createElement('mark');
              mark.className = 'bg-red-200 dark:bg-red-900/50';
              mark.textContent = selectedText;
              newNode = mark;
              break;
            }
            case 'yellow': {
              const mark = document.createElement('mark');
              mark.className = 'bg-yellow-200 dark:bg-yellow-900/50';
              mark.textContent = selectedText;
              newNode = mark;
              break;
            }
            case 'list': {
              const ul = document.createElement('ul');
              ul.className = 'list-disc list-inside my-2';
              const li = document.createElement('li');
              li.textContent = selectedText;
              ul.appendChild(li);
              newNode = ul;
              break;
            }
            case 'heading': {
              const h3 = document.createElement('h3');
              h3.className = 'text-lg font-bold mt-4 mb-2';
              h3.textContent = selectedText;
              newNode = h3;
              break;
            }
            default:
              return;
          }

          range.deleteContents();
          range.insertNode(newNode);
          
          // カーソルを挿入したノードの後ろに移動
          range.setStartAfter(newNode);
          range.setEndAfter(newNode);
          selection.removeAllRanges();
          selection.addRange(range);
        }

        notifyChange();
        updateActiveFormats();
      } else {
        // テキストが選択されていない場合の処理
        
        // 箇条書きの場合は行頭に「- 」を挿入/削除（トグル）
        if (format === 'list') {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            
            // 現在の行のテキストを取得
            let currentNode = range.startContainer;
            let lineStartNode: Node | null = null;
            let lineStartOffset = 0;
            
            // テキストノードの場合、その行の開始位置を見つける
            if (currentNode.nodeType === Node.TEXT_NODE) {
              const textContent = currentNode.textContent || '';
              const currentOffset = range.startOffset;
              
              // カーソル位置から前方に遡って行の開始位置を見つける
              const beforeText = textContent.substring(0, currentOffset);
              const lastNewlineIndex = beforeText.lastIndexOf('\n');
              
              if (lastNewlineIndex !== -1) {
                // 改行が見つかった場合、その直後が行の開始位置
                lineStartNode = currentNode;
                lineStartOffset = lastNewlineIndex + 1;
              } else {
                // 改行が見つからない場合、テキストノードの開始を確認
                // 前のノードを探索
                let prevNode: Node | null = currentNode.previousSibling;
                let foundLineStart = false;
                
                while (prevNode && !foundLineStart) {
                  if (prevNode.nodeType === Node.TEXT_NODE) {
                    const prevText = prevNode.textContent || '';
                    const prevNewlineIndex = prevText.lastIndexOf('\n');
                    
                    if (prevNewlineIndex !== -1) {
                      // 前のノードに改行が見つかった
                      lineStartNode = prevNode;
                      lineStartOffset = prevNewlineIndex + 1;
                      foundLineStart = true;
                    } else {
                      prevNode = prevNode.previousSibling;
                    }
                  } else if (prevNode.nodeName === 'BR') {
                    // <br>タグが見つかった場合、その直後が行の開���位置
                    lineStartNode = prevNode.nextSibling || currentNode;
                    lineStartOffset = 0;
                    foundLineStart = true;
                  } else {
                    prevNode = prevNode.previousSibling;
                  }
                }
                
                if (!foundLineStart) {
                  // 行の開始位置が見つからない = エディタの最初の行
                  lineStartNode = currentNode;
                  lineStartOffset = 0;
                }
              }
            } else if (currentNode === editorRef.current) {
              // エディタ自体がカーソル位置の場合
              if (currentNode.firstChild) {
                lineStartNode = currentNode.firstChild;
                lineStartOffset = 0;
              }
            } else {
              // 要素ノードの場合
              const children = Array.from(currentNode.childNodes);
              const offsetNode = children[range.startOffset];
              
              if (offsetNode && offsetNode.nodeType === Node.TEXT_NODE) {
                lineStartNode = offsetNode;
                lineStartOffset = 0;
              } else {
                lineStartNode = currentNode;
                lineStartOffset = range.startOffset;
              }
            }
            
            if (lineStartNode && lineStartNode.nodeType === Node.TEXT_NODE) {
              const textNode = lineStartNode as Text;
              const textContent = textNode.textContent || '';
              
              // 行の開始位置から行末までのテキストを取得
              const lineText = textContent.substring(lineStartOffset);
              
              // 次の改行までのテキストを取得（現在の行のテキスト）
              const lineEndIndex = lineText.indexOf('\n');
              const currentLineText = lineEndIndex !== -1 ? lineText.substring(0, lineEndIndex) : lineText;
              
              // 行頭に「- 」があるかチェック
              if (currentLineText.startsWith('- ')) {
                // 「- 」を削除
                const newText = 
                  textContent.substring(0, lineStartOffset) + 
                  textContent.substring(lineStartOffset + 2);
                
                textNode.textContent = newText;
                
                // カーソル位置を調整（「- 」が削除された分だけ前に移動）
                const newOffset = Math.max(0, range.startOffset - 2);
                range.setStart(textNode, newOffset);
                range.setEnd(textNode, newOffset);
                selection.removeAllRanges();
                selection.addRange(range);
              } else {
                // 「- 」を挿入
                const newText = 
                  textContent.substring(0, lineStartOffset) + 
                  '- ' + 
                  textContent.substring(lineStartOffset);
                
                textNode.textContent = newText;
                
                // カーソル位置を調整（「- 」が挿入された分だけ後ろに移動）
                const newOffset = range.startOffset + 2;
                range.setStart(textNode, newOffset);
                range.setEnd(textNode, newOffset);
                selection.removeAllRanges();
                selection.addRange(range);
              }
            } else if (!lineStartNode || !editorRef.current.textContent) {
              // エディタが空の場合、または行の開始位置が見つからない場合
              const textNode = document.createTextNode('- ');
              
              if (editorRef.current.firstChild) {
                editorRef.current.insertBefore(textNode, editorRef.current.firstChild);
              } else {
                editorRef.current.appendChild(textNode);
              }
              
              // カーソルを「- 」の後ろに移動
              const newRange = document.createRange();
              newRange.setStart(textNode, 2);
              newRange.setEnd(textNode, 2);
              selection.removeAllRanges();
              selection.addRange(newRange);
            }
            
            notifyChange();
            updateActiveFormats();
          }
          return;
        }
        
        // その他の装飾の場合は、トグル方式で装飾状態を切り替え
        const newFormats = new Set(activeFormatsRef.current); // refから最新の状態を取得
        
        if (newFormats.has(format)) {
          newFormats.delete(format);
        } else {
          newFormats.add(format);
        }
        
        setActiveFormats(newFormats);
        onActiveFormatsChange?.(newFormats);
        activeFormatsRef.current = newFormats; // 最新の装飾状態を保存
      }
    };

    // キーボード入力時に装飾を適用
    const handleBeforeInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
      if (!editorRef.current || disabled) return;
      
      // refから最新の装飾状態を取得
      const currentFormats = activeFormatsRef.current;
      
      console.log('handleBeforeInput called, currentFormats:', currentFormats, 'size:', currentFormats.size);
      
      const nativeEvent = (e as any).nativeEvent as InputEvent;
      
      console.log('inputType:', nativeEvent.inputType, 'data:', nativeEvent.data);
      
      // 装飾がない場合、ゼロ幅スペースを削除
      const selection = window.getSelection();
      if (currentFormats.size === 0 && selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const textNode = range.startContainer;
        
        // ゼロ幅スペースを削除
        if (textNode.nodeType === Node.TEXT_NODE && textNode.textContent === '\u200B') {
          textNode.textContent = '';
        }
        return;
      }
      
      if (currentFormats.size === 0) return;
      
      // 文字入力の場合のみ処理
      if (nativeEvent.inputType !== 'insertText' && nativeEvent.inputType !== 'insertFromPaste') {
        console.log('Skipping - not insertText or insertFromPaste');
        return;
      }

      console.log('Preventing default input, applying formats');
      e.preventDefault();

      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const text = nativeEvent.data || '';

      // 装飾を適用したテキストノードを作成
      let node: Node = document.createTextNode(text);

      // アクティブな装飾を適用（refから取得）
      if (currentFormats.has('bold')) {
        const strong = document.createElement('strong');
        strong.appendChild(node);
        node = strong;
      }

      if (currentFormats.has('underline')) {
        const u = document.createElement('u');
        u.className = 'underline';
        u.appendChild(node);
        node = u;
      }

      if (currentFormats.has('red')) {
        const mark = document.createElement('mark');
        mark.className = 'bg-red-200 dark:bg-red-900/50';
        mark.appendChild(node);
        node = mark;
      } else if (currentFormats.has('yellow')) {
        const mark = document.createElement('mark');
        mark.className = 'bg-yellow-200 dark:bg-yellow-900/50';
        mark.appendChild(node);
        node = mark;
      }

      if (currentFormats.has('heading')) {
        const h3 = document.createElement('h3');
        h3.className = 'text-lg font-bold mt-4 mb-2';
        h3.appendChild(node);
        node = h3;
      }

      if (currentFormats.has('list')) {
        const li = document.createElement('li');
        li.appendChild(node);
        
        // 既存のリストの中にいる場合は、そのリストに追加
        let parentList = range.startContainer.parentElement;
        while (parentList && parentList.tagName !== 'UL' && parentList !== editorRef.current) {
          parentList = parentList.parentElement;
        }

        if (parentList && parentList.tagName === 'UL') {
          node = li;
        } else {
          const ul = document.createElement('ul');
          ul.className = 'list-disc list-inside my-2';
          ul.appendChild(li);
          node = ul;
        }
      }

      // ノードを挿入
      range.deleteContents();
      range.insertNode(node);

      // 装飾タグの外に空のテキストノードを作成してカーソルを移動
      const emptyTextNode = document.createTextNode('\u200B'); // ゼロ幅スペース
      const newRange = document.createRange();
      newRange.setStartAfter(node);
      newRange.collapse(true);
      newRange.insertNode(emptyTextNode);
      
      // カーソルを空のテキストノードの後ろに移動
      newRange.setStartAfter(emptyTextNode);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);

      notifyChange();
    }, [disabled]);

    // 装飾付きテキストを挿入する共通関数
    const insertFormattedText = useCallback((text: string, formats: Set<string>) => {
      if (!editorRef.current || !text) return;

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);

      // 装飾を適用したテキストノードを作成
      let node: Node = document.createTextNode(text);

      // アクティブな装飾を適用
      if (formats.has('bold')) {
        const strong = document.createElement('strong');
        strong.appendChild(node);
        node = strong;
      }

      if (formats.has('underline')) {
        const u = document.createElement('u');
        u.className = 'underline';
        u.appendChild(node);
        node = u;
      }

      if (formats.has('red')) {
        const mark = document.createElement('mark');
        mark.className = 'bg-red-200 dark:bg-red-900/50';
        mark.appendChild(node);
        node = mark;
      } else if (formats.has('yellow')) {
        const mark = document.createElement('mark');
        mark.className = 'bg-yellow-200 dark:bg-yellow-900/50';
        mark.appendChild(node);
        node = mark;
      }

      if (formats.has('heading')) {
        const h3 = document.createElement('h3');
        h3.className = 'text-lg font-bold mt-4 mb-2';
        h3.appendChild(node);
        node = h3;
      }

      if (formats.has('list')) {
        const li = document.createElement('li');
        li.appendChild(node);
        
        // 既存のリストの中にいる場合は、そのリストに追加
        let parentList = range.startContainer.parentElement;
        while (parentList && parentList.tagName !== 'UL' && parentList !== editorRef.current) {
          parentList = parentList.parentElement;
        }

        if (parentList && parentList.tagName === 'UL') {
          node = li;
        } else {
          const ul = document.createElement('ul');
          ul.className = 'list-disc list-inside my-2';
          ul.appendChild(li);
          node = ul;
        }
      }

      // ノードを挿入
      range.deleteContents();
      range.insertNode(node);

      // 装飾タグの外に通常のテキストノードを作成してカーソルを移動
      // 空のテキストノードではなく、スペースを使用
      const spaceNode = document.createTextNode(' ');
      const newRange = document.createRange();
      newRange.setStartAfter(node);
      newRange.collapse(true);
      newRange.insertNode(spaceNode);
      
      // カーソルをスペースの後ろに移動
      newRange.setStartAfter(spaceNode);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
      
      console.log('Inserted formatted text, cursor parent:', newRange.startContainer.parentElement?.tagName);

      notifyChange();
    }, []);

    // IME入力の開始
    const handleCompositionStart = useCallback(() => {
      isComposingRef.current = true;
      
      // IME開始時のカーソル位置を記録
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        compositionStartPosRef.current = {
          node: range.startContainer,
          offset: range.startOffset
        };
      }
      
      console.log('Composition started, position recorded');
    }, []);

    // IME入力の終了（日本語確定時）
    const handleCompositionEnd = useCallback((e: React.CompositionEvent<HTMLDivElement>) => {
      isComposingRef.current = false;
      const currentFormats = activeFormatsRef.current;
      const composedText = e.data;
      
      console.log('Composition ended, data:', composedText, 'formats:', currentFormats, 'size:', currentFormats.size);
      
      // 装飾が不要な場合はデフォルトの挿入を許可
      if (currentFormats.size === 0) {
        compositionStartPosRef.current = null;
        return;
      }

      // IME確定後に装飾を適用
      setTimeout(() => {
        if (!editorRef.current || !composedText) return;

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        // 確定されたテキストを検索して削除
        const range = selection.getRangeAt(0);
        let currentNode = range.startContainer;
        
        // テキストノードを探す
        if (currentNode.nodeType === Node.ELEMENT_NODE) {
          // カーソルの直前のノードを探す
          const offset = range.startOffset;
          if (offset > 0) {
            currentNode = currentNode.childNodes[offset - 1] || currentNode;
          }
        }

        // テキストノードの場合、確定されたテキストを含むかチェック
        if (currentNode.nodeType === Node.TEXT_NODE && currentNode.textContent) {
          const textContent = currentNode.textContent;
          const composedTextIndex = textContent.lastIndexOf(composedText);
          
          if (composedTextIndex !== -1) {
            // 確定されたテキストの位置を特定
            const textNode = currentNode as Text;
            const beforeText = textContent.substring(0, composedTextIndex);
            const afterText = textContent.substring(composedTextIndex + composedText.length);
            
            // テキストノードを分割
            const parent = textNode.parentNode;
            if (parent) {
              // 前のテキスト
              if (beforeText) {
                const beforeNode = document.createTextNode(beforeText);
                parent.insertBefore(beforeNode, textNode);
              }
              
              // 装飾付きの確定テキストを挿入
              const newRange = document.createRange();
              newRange.setStart(parent, Array.from(parent.childNodes).indexOf(textNode));
              newRange.collapse(true);
              selection.removeAllRanges();
              selection.addRange(newRange);
              
              // 元のテキストノードを削除
              parent.removeChild(textNode);
              
              // 装飾付きテキストを挿入
              insertFormattedText(composedText, currentFormats);
              
              // 後のテキスト
              if (afterText) {
                const selection2 = window.getSelection();
                if (selection2 && selection2.rangeCount > 0) {
                  const range2 = selection2.getRangeAt(0);
                  const afterNode = document.createTextNode(afterText);
                  range2.insertNode(afterNode);
                  
                  // カーソルを後のテキストの前に配置
                  const finalRange = document.createRange();
                  finalRange.setStartBefore(afterNode);
                  finalRange.collapse(true);
                  selection2.removeAllRanges();
                  selection2.addRange(finalRange);
                }
              }
            }
          }
        }
        
        compositionStartPosRef.current = null;
      }, 0);
    }, [insertFormattedText]);

    // 外部から参照できるメソッドを公開
    useImperativeHandle(ref, () => ({
      getEditor: () => editorRef.current,
      focus: () => editorRef.current?.focus(),
      applyFormat: (format: string) => {
        handleFormat(format);
      },
      getActiveFormats: () => activeFormatsRef.current, // 最新の装飾状態を返す
      insertText: (text: string) => {
        if (!editorRef.current || disabled) return;

        editorRef.current.focus();
        const selection = window.getSelection();
        if (!selection) return;

        let range: Range;
        if (selection.rangeCount > 0) {
          range = selection.getRangeAt(0);
        } else {
          // カーソルがない場合は末尾に挿入
          range = document.createRange();
          range.selectNodeContents(editorRef.current);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        }

        const node = document.createTextNode(text);
        range.deleteContents();
        range.insertNode(node);

        // カーソルを挿入したノードの後ろに移動
        const newRange = document.createRange();
        newRange.setStartAfter(node);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);

        notifyChange();
      },
      insertSchema: (schemaId: number) => {
        if (!editorRef.current || disabled) return;

        editorRef.current.focus();
        const selection = window.getSelection();
        if (!selection) return;

        let range: Range;
        if (selection.rangeCount > 0) {
          range = selection.getRangeAt(0);
        } else {
          // カーソルがない場合は末尾に挿入
          range = document.createRange();
          range.selectNodeContents(editorRef.current);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        }

        // シェーママーカーを挿入
        const schemaMarker = `\n\n[シェーマ:schema_${schemaId}]\n\n`;
        const node = document.createTextNode(schemaMarker);
        range.deleteContents();
        range.insertNode(node);

        // カーソルを挿入したノードの後ろに移動
        const newRange = document.createRange();
        newRange.setStartAfter(node);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);

        notifyChange();
      },
    }));

    // カーソル移動やクリック時に装飾状態を更新
    const handleSelectionChange = useCallback(() => {
      updateActiveFormats();
    }, [updateActiveFormats]);

    // 外部からのvalue変更を反映
    useEffect(() => {
      if (!editorRef.current || isUpdatingRef.current) return;
      
      const currentMarkup = htmlToMarkup(editorRef.current.innerHTML);
      if (currentMarkup !== value) {
        isUpdatingRef.current = true;
        const html = markupToHtml(value);
        editorRef.current.innerHTML = html;
        isUpdatingRef.current = false;
      }
    }, [value]);

    // セレクション変更イベントをリスン
    useEffect(() => {
      document.addEventListener('selectionchange', handleSelectionChange);
      return () => {
        document.removeEventListener('selectionchange', handleSelectionChange);
      };
    }, [handleSelectionChange]);

    // ドラッグ開始
    const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      
      // シェーマブロックのドラッグのみを処理
      if (target.classList.contains('schema-block')) {
        draggedSchemaRef.current = target;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', target.outerHTML);
        
        // ドラッグ中の視覚的フィードバック
        target.style.opacity = '0.5';
      }
    }, []);

    // ドラッグオーバー
    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      if (!draggedSchemaRef.current) return;
      
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      
      // ドロップ位置のインジケーターを表示
      const target = e.target as HTMLElement;
      const editor = editorRef.current;
      if (!editor) return;
      
      // カーソル位置を取得（ブラウザ互換性対応）
      let range: Range | null = null;
      if (document.caretRangeFromPoint) {
        // Chrome, Safari
        range = document.caretRangeFromPoint(e.clientX, e.clientY);
      } else if ((document as any).caretPositionFromPoint) {
        // Firefox
        const position = (document as any).caretPositionFromPoint(e.clientX, e.clientY);
        if (position) {
          range = document.createRange();
          range.setStart(position.offsetNode, position.offset);
        }
      }
      
      if (!range) return;
      
      // 既存のインジケーターを削除
      if (dropIndicatorRef.current && dropIndicatorRef.current.parentNode) {
        dropIndicatorRef.current.parentNode.removeChild(dropIndicatorRef.current);
      }
      
      // 新しいインジケーターを作成
      const indicator = document.createElement('div');
      indicator.className = 'drop-indicator';
      indicator.style.cssText = `
        position: absolute;
        height: 3px;
        background-color: #3b82f6;
        width: 100%;
        pointer-events: none;
        z-index: 1000;
      `;
      
      // インジケーターを挿入位置に配置
      range.insertNode(indicator);
      dropIndicatorRef.current = indicator;
    }, []);

    // ドロップ
    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      
      if (!draggedSchemaRef.current) return;
      
      const editor = editorRef.current;
      if (!editor) return;
      
      // ドロップ位置を取得（ブラウザ互換性対応）
      let range: Range | null = null;
      if (document.caretRangeFromPoint) {
        // Chrome, Safari
        range = document.caretRangeFromPoint(e.clientX, e.clientY);
      } else if ((document as any).caretPositionFromPoint) {
        // Firefox
        const position = (document as any).caretPositionFromPoint(e.clientX, e.clientY);
        if (position) {
          range = document.createRange();
          range.setStart(position.offsetNode, position.offset);
        }
      }
      
      if (!range) return;
      
      // インジケーターを削除
      if (dropIndicatorRef.current && dropIndicatorRef.current.parentNode) {
        dropIndicatorRef.current.parentNode.removeChild(dropIndicatorRef.current);
        dropIndicatorRef.current = null;
      }
      
      // ドラッグ中のシェーマブロックをドロップ位置に移動
      const draggedElement = draggedSchemaRef.current;
      const schemaId = draggedElement.getAttribute('data-schema-id');
      
      if (schemaId) {
        // 元のシェーマブロックを削除
        draggedElement.parentNode?.removeChild(draggedElement);
        
        // ドロップ位置にシェーママーカーを挿入
        const schemaMarker = `\n\n[シェーマ:schema_${schemaId}]\n\n`;
        const textNode = document.createTextNode(schemaMarker);
        range.insertNode(textNode);
        
        // カーソルを移動
        const newRange = document.createRange();
        newRange.setStartAfter(textNode);
        newRange.collapse(true);
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
        
        // 変更を通知してマークアップを保存
        notifyChange();
        
        // ドロップ後、即座にHTMLに再変換して画像として表示
        setTimeout(() => {
          if (!editor || isUpdatingRef.current) return;
          
          const currentHtml = editor.innerHTML;
          const markup = htmlToMarkup(currentHtml);
          const newHtml = markupToHtml(markup);
          
          if (newHtml !== currentHtml) {
            isUpdatingRef.current = true;
            editor.innerHTML = newHtml;
            
            // カーソル位置を復元
            if (selection) {
              const newRange = document.createRange();
              newRange.selectNodeContents(editor);
              newRange.collapse(false);
              selection.removeAllRanges();
              selection.addRange(newRange);
            }
            
            isUpdatingRef.current = false;
          }
        }, 10);
      }
      
      // 透明度をリセット
      draggedSchemaRef.current = null;
    }, []);

    // ドラッグ終了
    const handleDragEnd = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      
      // 透明度をリセット
      if (target.classList.contains('schema-block')) {
        target.style.opacity = '1';
      }
      
      // インジケーターを削除
      if (dropIndicatorRef.current && dropIndicatorRef.current.parentNode) {
        dropIndicatorRef.current.parentNode.removeChild(dropIndicatorRef.current);
        dropIndicatorRef.current = null;
      }
      
      draggedSchemaRef.current = null;
    }, []);

    return (
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onBeforeInput={handleBeforeInput as any}
        onInput={notifyChange}
        onKeyUp={updateActiveFormats}
        onClick={updateActiveFormats}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        className={cn(
          "min-h-[500px] p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary",
          "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
          "border border-gray-200 dark:border-gray-700 rounded-lg",
          "overflow-y-auto whitespace-pre-wrap break-words",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        data-placeholder={placeholder}
        suppressContentEditableWarning
        style={{
          // プレースホルダーのスタイル
          ...(editorRef.current?.textContent === '' && {
            position: 'relative',
          })
        }}
      />
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";