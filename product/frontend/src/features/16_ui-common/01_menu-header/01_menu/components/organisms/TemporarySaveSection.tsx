"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/card";
import { Badge } from "@/shared/components/atoms/badge";
import { Button } from "@/shared/components/atoms/button";
import { Checkbox } from "@/shared/components/atoms/checkbox";
import { Save, FileText, Clock } from "lucide-react";
import { useState } from "react";
import { temporarySaveData } from "../../assets/proxyInputData";
import type { ThemeColor } from "../../types/theme.type";
import { i18n } from "@/shared/i18n";

const t = i18n.menu;

interface TemporarySaveSectionProps {
  theme: ThemeColor;
}

export function TemporarySaveSection({ theme }: TemporarySaveSectionProps) {
  const tempSaveItems = temporarySaveData;
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleToggle = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  return (
    <Card style={{ 
      backgroundColor: theme.value === 'black' ? '#1A1A1A' : undefined,
      borderColor: theme.value === 'black' ? '#333333' : undefined,
      color: theme.value === 'black' ? '#E5E7EB' : undefined
    }}>
      <CardHeader style={{ backgroundColor: theme.secondary }}>
        <div className="flex items-center justify-between">
          <CardTitle style={{ color: theme.primary }}>{t.temporarySaveSection.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {i18n.common.units.items(tempSaveItems.length)}
            </Badge>
            <Button size="sm" variant="outline" style={{
              color: theme.value === 'black' ? '#FFFFFF' : undefined,
              backgroundColor: theme.value === 'black' ? '#404040' : undefined,
              borderColor: theme.value === 'black' ? '#6B7280' : undefined
            }}>
              {t.temporarySaveSection.loadButton}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4" style={{
        backgroundColor: theme.value === 'black' ? '#1A1A1A' : undefined
      }}>
        <div className="space-y-3">
          <div className="text-xs" style={{
            color: theme.value === 'black' ? '#9CA3AF' : undefined
          }}>{t.temporarySaveSection.list}</div>
          {tempSaveItems.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-md border ${theme.value === 'black' ? '' : 'bg-blue-50 border-blue-200 hover:bg-blue-100'} transition-colors cursor-pointer`}
              style={theme.value === 'black' ? {
                backgroundColor: '#262626',
                borderColor: '#404040'
              } : undefined}
              onClick={() => handleToggle(item.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Checkbox
                      id={`temp-${item.id}`}
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => {}}
                    />
                    <FileText className="h-4 w-4" style={{ 
                      color: theme.value === 'black' ? '#60A5FA' : undefined 
                    }} />
                    <span className="text-sm" style={{
                      color: theme.value === 'black' ? '#E5E7EB' : undefined
                    }}>{item.patientName}</span>
                  </div>
                  <div className="text-xs ml-6" style={{
                    color: theme.value === 'black' ? '#9CA3AF' : undefined
                  }}>
                    {t.temporarySaveSection.inputBy}{item.savedBy}
                  </div>
                  <div className="text-xs mt-1 ml-6" style={{ 
                    color: theme.value === 'black' ? '#60A5FA' : undefined 
                  }}>
                    {item.recordType} - {item.status}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs" style={{
                  color: theme.value === 'black' ? '#60A5FA' : undefined
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
  );
}