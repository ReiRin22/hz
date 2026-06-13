'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/shared/components/atoms/button';
import { ScrollArea } from '@/shared/components/atoms/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/atoms/tabs';
import { X, Edit, MessageSquare, GripVertical } from 'lucide-react';
import type { CommentOption } from '../../types/recordInput.type';

type DraggableCommentPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  comments: CommentOption[];
  onCommentSelect: (comment: CommentOption) => void;
  onCommentTabChange: (type: 'MY' | 'PATIENT' | 'DEPT') => void;
  onMyCommentManagementOpen: () => void;
  soapContainerRef?: React.RefObject<HTMLDivElement>;
};

export function DraggableCommentPopup({
  isOpen,
  onClose,
  comments,
  onCommentSelect,
  onCommentTabChange,
  onMyCommentManagementOpen,
  soapContainerRef,
}: DraggableCommentPopupProps) {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && popupRef.current) {
      if (soapContainerRef?.current) {
        const soapRect = soapContainerRef.current.getBoundingClientRect();
        setPosition({ x: soapRect.right + 12, y: soapRect.top });
      } else {
        const popupRect = popupRef.current.getBoundingClientRect();
        setPosition({ x: window.innerWidth - popupRect.width - 20, y: 100 });
      }
    }
  }, [isOpen, soapContainerRef]);

  useEffect(() => {
    const handleResize = () => {
      if (isOpen && popupRef.current && soapContainerRef?.current && !isDragging) {
        const soapRect = soapContainerRef.current.getBoundingClientRect();
        setPosition({ x: soapRect.right + 12, y: soapRect.top });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, soapContainerRef, isDragging]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
      }
    };
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const myComments = comments.filter((c) => c.type === 'MY');
  const patientComments = comments.filter((c) => c.type === 'PATIENT');
  const deptComments = comments.filter((c) => c.type === 'DEPT');

  return (
    <div
      ref={popupRef}
      className="fixed bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl"
      style={{ left: `${position.x}px`, top: `${position.y}px`, zIndex: 9999, width: '340px', cursor: isDragging ? 'grabbing' : 'default' }}
    >
      <div
        className="p-2 border-b flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-t-lg cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => {
          if (popupRef.current) {
            const rect = popupRef.current.getBoundingClientRect();
            setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            setIsDragging(true);
          }
        }}
      >
        <div className="flex items-center space-x-2">
          <GripVertical className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium">コメント選択</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { onClose(); onMyCommentManagementOpen(); }}
            className="h-7 text-xs"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Edit className="w-3 h-3 mr-1" />
            Myコメント管理
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <X className="w-4 h-4" />
            <span className="sr-only">閉じる</span>
          </Button>
        </div>
      </div>

      <div onMouseDown={(e) => e.stopPropagation()}>
        <Tabs
          defaultValue="my"
          className="w-full"
          onValueChange={(v) => onCommentTabChange(v === 'my' ? 'MY' : v === 'patient' ? 'PATIENT' : 'DEPT')}
        >
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="my">Myコメント</TabsTrigger>
            <TabsTrigger value="patient">患者別</TabsTrigger>
            <TabsTrigger value="department">診療科</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[300px]">
            {(['my', 'patient', 'department'] as const).map((tab) => {
              const tabComments = tab === 'my' ? myComments : tab === 'patient' ? patientComments : deptComments;
              const iconColor = tab === 'my' ? 'text-blue-500' : tab === 'patient' ? 'text-green-500' : 'text-purple-500';
              return (
                <TabsContent key={tab} value={tab} className="m-0 p-1.5">
                  <div className="space-y-0.5">
                    {tabComments.map((comment) => (
                      <div
                        key={comment.id}
                        onClick={() => onCommentSelect(comment)}
                        className="p-2 hover:bg-accent rounded-lg cursor-pointer transition-colors border border-transparent hover:border-primary/20"
                      >
                        <div className="flex items-start space-x-1.5">
                          <MessageSquare className={`w-4 h-4 mt-0 ${iconColor} flex-shrink-0`} />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm line-clamp-2 whitespace-pre-wrap">{comment.content}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              );
            })}
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
}
