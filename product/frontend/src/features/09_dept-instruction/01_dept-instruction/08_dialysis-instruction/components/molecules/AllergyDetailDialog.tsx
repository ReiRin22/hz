import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/components/atoms/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/components/atoms/tabs';
import { Button } from '@shared/components/atoms/button';
import { Input } from '@shared/components/atoms/input';
import { Badge } from '@shared/components/atoms/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/components/atoms/table';
import { Search, Download, AlertTriangle } from 'lucide-react';
import type { Order } from '../../types';
import { contraindications, medicalHistory } from '../../lib/mockData';

interface AllergyDetailDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}

export function AllergyDetailDialog({ open, onClose, order }: AllergyDetailDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('allergies');

  if (!order) return null;

  const handleExportCSV = () => {
    console.log('CSVエクスポート実行');
    // 閲覧ログを記録
    const log = {
      user: '看護師C',
      timestamp: new Date().toLocaleString('ja-JP'),
      patientId: order.patientId,
      action: 'アレルギー詳細閲覧'
    };
    console.log('閲覧ログ:', log);
  };

  const handleClose = () => {
    // 閲覧ログを記録
    const log = {
      user: '看護師C',
      timestamp: new Date().toLocaleString('ja-JP'),
      patientId: order.patientId,
      action: 'アレルギー詳細閲覧終了'
    };
    console.log('閲覧ログ:', log);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            アレルギー詳細（W5） - {order.patientName} ({order.patientId})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 検索バー */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={handleExportCSV} className="gap-2">
              <Download className="h-4 w-4" />
              CSVエクスポート
            </Button>
          </div>

          {/* タブ */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="allergies">アレルギー一覧</TabsTrigger>
              <TabsTrigger value="contraindications">禁忌・相互作用</TabsTrigger>
              <TabsTrigger value="history">既往歴・注意情報</TabsTrigger>
            </TabsList>

            {/* アレルギー一覧タブ */}
            <TabsContent value="allergies" className="space-y-4">
              {order.allergies.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>成分名</TableHead>
                      <TableHead>重症度</TableHead>
                      <TableHead>症状</TableHead>
                      <TableHead>登録日</TableHead>
                      <TableHead>情報源</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.allergies.map((allergy) => (
                      <TableRow key={allergy.id}>
                        <TableCell>{allergy.component}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              allergy.severity === '重度' ? 'destructive' : 
                              allergy.severity === '中等度' ? 'secondary' : 
                              'outline'
                            }
                          >
                            {allergy.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>{allergy.symptoms}</TableCell>
                        <TableCell>{allergy.registeredDate}</TableCell>
                        <TableCell>{allergy.source}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  アレルギー情報はありません
                </div>
              )}
            </TabsContent>

            {/* 禁忌・相互作用タブ */}
            <TabsContent value="contraindications" className="space-y-4">
              <div className="space-y-3">
                {contraindications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border ${
                      item.match
                        ? 'bg-red-50 border-red-500 border-2'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    {item.match && (
                      <div className="flex items-center gap-2 text-red-600 mb-2">
                        <AlertTriangle className="h-5 w-5" />
                        <span>当該オーダとの一致あり</span>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">薬剤名</div>
                        <div>{item.medication}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">アレルゲン</div>
                        <div>{item.allergen}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">重症度</div>
                        <Badge variant={item.severity === '禁忌' ? 'destructive' : 'secondary'}>
                          {item.severity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* 既往歴・注意情報タブ */}
            <TabsContent value="history" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>疾患名</TableHead>
                    <TableHead>診断日</TableHead>
                    <TableHead>状態</TableHead>
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

          {/* 閉じるボタン */}
          <div className="flex justify-end pt-4">
            <Button onClick={handleClose}>閉じる</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
