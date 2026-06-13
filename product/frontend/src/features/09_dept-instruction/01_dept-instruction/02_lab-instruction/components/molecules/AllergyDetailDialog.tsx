'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/components/atoms/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/components/atoms/tabs';
import { Button } from '@shared/components/atoms/button';
import { Input } from '@shared/components/atoms/input';
import { Badge } from '@shared/components/atoms/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/components/atoms/table';
import { Search, Download, AlertTriangle } from 'lucide-react';
import type { Order } from '../../types/deptInstruction.viewmodel';
import { i18n } from '@/shared/i18n';

const { deptInstruction: di } = i18n;
const ad = di.allergyDialog;

export interface Contraindication {
  id: string;
  medication: string;
  allergen: string;
  severity: string;
  match: boolean;
}

export interface MedicalHistoryItem {
  id: string;
  condition: string;
  diagnosedDate: string;
  status: string;
}

interface AllergyDetailDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  contraindications?: Contraindication[];
  medicalHistory?: MedicalHistoryItem[];
  currentUser?: string;
}

export function AllergyDetailDialog({ open, onClose, order, contraindications = [], medicalHistory = [], currentUser }: AllergyDetailDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('allergies');

  if (!order) return null;

  const handleExportCSV = () => {
    // TODO: 閲覧ログ API 実装後に差し替え（audit-log エンドポイント）
    void currentUser;
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {ad.title(order.patientName, order.patientId)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={ad.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={handleExportCSV} className="gap-2">
              <Download className="h-4 w-4" />
              {ad.exportCsv}
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="allergies">{ad.tabs.allergies}</TabsTrigger>
              <TabsTrigger value="contraindications">{ad.tabs.contraindications}</TabsTrigger>
              <TabsTrigger value="history">{ad.tabs.history}</TabsTrigger>
            </TabsList>

            <TabsContent value="allergies" className="space-y-4">
              {order.allergies.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{ad.allergyTable.component}</TableHead>
                      <TableHead>{ad.allergyTable.severity}</TableHead>
                      <TableHead>{ad.allergyTable.symptoms}</TableHead>
                      <TableHead>{ad.allergyTable.registeredDate}</TableHead>
                      <TableHead>{ad.allergyTable.source}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.allergies.map((allergy) => {
                      const severityLabel = di.allergySeverityLabels[allergy.severity as keyof typeof di.allergySeverityLabels] ?? allergy.severity;
                      return (
                        <TableRow key={allergy.id}>
                          <TableCell>{allergy.component}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                allergy.severity === 'SEVERE' ? 'destructive' :
                                allergy.severity === 'MODERATE' ? 'secondary' :
                                'outline'
                              }
                            >
                              {severityLabel}
                            </Badge>
                          </TableCell>
                          <TableCell>{allergy.symptoms}</TableCell>
                          <TableCell>{allergy.registeredDate}</TableCell>
                          <TableCell>{allergy.source}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {ad.allergyTable.noData}
                </div>
              )}
            </TabsContent>

            <TabsContent value="contraindications" className="space-y-4">
              <div className="space-y-3">
                {contraindications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border ${
                      item.match ? 'bg-red-50 border-red-500 border-2' : 'bg-white border-gray-200'
                    }`}
                  >
                    {item.match && (
                      <div className="flex items-center gap-2 text-red-600 mb-2">
                        <AlertTriangle className="h-5 w-5" />
                        <span>{ad.contraindication.matchAlert}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">{ad.contraindication.medication}</div>
                        <div>{item.medication}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">{ad.contraindication.allergen}</div>
                        <div>{item.allergen}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">{ad.contraindication.severity}</div>
                        <Badge variant={item.severity === '禁忌' ? 'destructive' : 'secondary'}>
                          {item.severity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{ad.historyTable.condition}</TableHead>
                    <TableHead>{ad.historyTable.diagnosedDate}</TableHead>
                    <TableHead>{ad.historyTable.status}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medicalHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.condition}</TableCell>
                      <TableCell>{item.diagnosedDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-4">
            <Button onClick={onClose}>{ad.close}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
