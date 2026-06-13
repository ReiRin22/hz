"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/atoms/dialog";
import { Button } from "@/shared/components/atoms/button";

export function FetchErrorDialog() {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogTitle className="sr-only">データ取得エラー</DialogTitle>
        <div className="flex items-center gap-2 bg-red-500 text-white px-6 py-4 text-base font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>データ取得エラー</span>
        </div>
        <div className="px-6 py-4 space-y-4">
          <DialogDescription>
            データの読み込みに失敗しました。ページを再読み込みしてください。
          </DialogDescription>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              閉じる
            </Button>
            <Button onClick={() => window.location.reload()}>再読み込み</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
