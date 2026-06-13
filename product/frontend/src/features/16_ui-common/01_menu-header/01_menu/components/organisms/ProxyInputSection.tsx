"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/card";
import { Badge } from "@/shared/components/atoms/badge";
import { Button } from "@/shared/components/atoms/button";
import { Checkbox } from "@/shared/components/atoms/checkbox";
import { AlertCircle, Clock, Save, FileText } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/atoms/alert-dialog";
import { proxyInputsData, temporarySaveData } from "../../assets/proxyInputData";
import type { ThemeColor } from "../../types/theme.type";
import { i18n } from "@/shared/i18n";

const t = i18n.menu;

interface ProxyInputSectionProps {
  theme: ThemeColor;
}

export function ProxyInputSection({ theme }: ProxyInputSectionProps) {
  const [showAlert, setShowAlert] = useState(false);
  const [showTempSaveAlert, setShowTempSaveAlert] = useState(false);
  const [selectedTempSaveIds, setSelectedTempSaveIds] = useState<number[]>([]);
  const tempSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const proxyInputs = proxyInputsData;
  const tempSaveItems = temporarySaveData;

  const overdueCount = proxyInputs.filter((item) => item.isOverdue).length;

  useEffect(() => {
    if (proxyInputs.length > 0) {
      setShowAlert(true);
    }
    return () => {
      if (tempSaveTimerRef.current) clearTimeout(tempSaveTimerRef.current);
    };
  }, [proxyInputs.length]);

  const handleProxyAlertClose = () => {
    setShowAlert(false);
    if (tempSaveItems.length > 0) {
      tempSaveTimerRef.current = setTimeout(() => {
        setShowTempSaveAlert(true);
      }, 300);
    }
  };

  const handleTempSaveToggle = (id: number) => {
    setSelectedTempSaveIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleLoadTempSave = () => {
    setShowTempSaveAlert(false);
    setSelectedTempSaveIds([]);
  };

  return (
    <>
      <Card style={{ 
        backgroundColor: theme.value === 'black' ? '#1A1A1A' : undefined,
        borderColor: theme.value === 'black' ? '#333333' : undefined,
        color: theme.value === 'black' ? '#E5E7EB' : undefined
      }}>
        <CardHeader style={{ backgroundColor: theme.secondary }}>
          <div className="flex items-center justify-between">
            <CardTitle style={{ color: theme.primary }}>{t.proxyInputSection.title}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={overdueCount > 0 ? "destructive" : "secondary"}>
                {i18n.common.units.items(proxyInputs.length)}
              </Badge>
              <Button size="sm" variant="outline" style={{
                color: theme.value === 'black' ? '#FFFFFF' : undefined,
                backgroundColor: theme.value === 'black' ? '#404040' : undefined,
                borderColor: theme.value === 'black' ? '#6B7280' : undefined
              }}>
                {t.proxyInputSection.approvalButton}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4" style={{
          backgroundColor: theme.value === 'black' ? '#1A1A1A' : undefined
        }}>
          {/* 個別の代行入力データ */}
          <div className="space-y-3">
            <div className="text-xs" style={{
              color: theme.value === 'black' ? '#9CA3AF' : undefined
            }}>{t.proxyInputSection.pendingList}</div>
            {proxyInputs.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-md border ${
                item.isOverdue
                  ? "bg-red-50 border-red-200"
                  : theme.value === 'black' ? "" : "bg-white border-gray-200"
              }`}
              style={
                !item.isOverdue && theme.value === 'black'
                  ? { backgroundColor: '#262626', borderColor: '#404040' }
                  : undefined
              }
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {item.isOverdue && (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm" style={{
                      color: item.isOverdue ? '#1F2937' : (theme.value === 'black' ? '#E5E7EB' : undefined)
                    }}>{item.patientName}</span>
                  </div>
                  <div className="text-xs" style={{
                    color: item.isOverdue ? '#1F2937' : (theme.value === 'black' ? '#9CA3AF' : undefined)
                  }}>
                    {t.proxyInputSection.inputBy}{item.inputBy}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs" style={{
                  color: item.isOverdue ? '#1F2937' : (theme.value === 'black' ? '#9CA3AF' : undefined)
                }}>
                  <Clock className="h-3 w-3" />
                  {i18n.common.units.hoursAgo(item.hoursAgo)}
                </div>
              </div>
            </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              {t.proxyInputSection.alert.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t.proxyInputSection.alert.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 my-4 max-h-[400px] overflow-y-auto">
            {proxyInputs.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-md border ${
                  item.isOverdue
                    ? "bg-red-50 border-red-200"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {item.isOverdue && (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm">{item.patientName}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t.proxyInputSection.inputBy}{item.inputBy}
                    </div>
                  </div>
                  <div className={`text-xs ${item.isOverdue ? "text-red-600" : "text-muted-foreground"}`}>
                    {i18n.common.units.hoursAgo(item.hoursAgo)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleProxyAlertClose}>
              {t.proxyInputSection.alert.hold}
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => setShowAlert(false)}>
              {t.proxyInputSection.approvalButton}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showTempSaveAlert} onOpenChange={setShowTempSaveAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Save className="h-5 w-5 text-blue-600" />
              {t.temporarySaveSection.alert.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t.temporarySaveSection.alert.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 my-4 max-h-[400px] overflow-y-auto">
            {tempSaveItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-md border bg-blue-50 border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => handleTempSaveToggle(item.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`temp-save-${item.id}`}
                      checked={selectedTempSaveIds.includes(item.id)}
                      onCheckedChange={() => {}}
                    />
                    <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span className="text-sm">{item.patientName}</span>
                  </div>
                  <div className="text-xs text-blue-600">
                    {i18n.common.units.hoursAgo(item.hoursAgo)}
                  </div>
                </div>
                <div className="ml-10 space-y-1">
                  <div className="text-xs text-muted-foreground">
                    {t.temporarySaveSection.inputBy}{item.savedBy}
                  </div>
                  <div className="text-xs text-blue-600">
                    {item.recordType} - {item.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowTempSaveAlert(false)}>
              {t.temporarySaveSection.alert.hold}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleLoadTempSave}>
              {t.temporarySaveSection.alert.load}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}