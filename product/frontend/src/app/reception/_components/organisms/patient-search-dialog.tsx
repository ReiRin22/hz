import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../atoms/dialog';
import { Button } from '../atoms/button';
import { Input } from '../atoms/input';
import { Label } from '../atoms/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/table';
import { Badge } from '../atoms/badge';
import { X, Search, User } from 'lucide-react';

interface Patient {
  id: string;
  patientNo: string;
  name: string;
  nameKana: string;
  age: number;
  gender: string;
  birthDate: string;
  department: string;
  doctor: string;
  phone1?: string;
  lastVisitDate?: string;
  status: string;
}

interface PatientSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPatient: (patient: Patient) => void;
}

export function PatientSearchDialog({ isOpen, onClose, onSelectPatient }: PatientSearchDialogProps) {
  const [searchCriteria, setSearchCriteria] = useState({
    patientId: '',
    nameKana: '',
    nameKanji: '',
    birthDate: ''
  });

  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 模擬患者データベース
  const patientDatabase: Patient[] = [
    {
      id: '1',
      patientNo: 'P001',
      name: '佐藤花子',
      nameKana: 'サトウハナコ',
      age: 65,
      gender: '女性',
      birthDate: '1959/03/15',
      department: '外科',
      doctor: '田中医師',
      phone1: '090-1111-1111',
      lastVisitDate: '2024/12/20',
      status: '通院中'
    },
    {
      id: '2',
      patientNo: 'P002',
      name: '田中太郎',
      nameKana: 'タナカタロウ',
      age: 45,
      gender: '男性',
      birthDate: '1979/07/22',
      department: '内科',
      doctor: '山田医師',
      phone1: '090-2222-2222',
      lastVisitDate: '2024/12/25',
      status: '通院中'
    },
    {
      id: '3',
      patientNo: 'P003',
      name: '山田花子',
      nameKana: 'ヤマダハナコ',
      age: 32,
      gender: '女性',
      birthDate: '1992/11/08',
      department: '皮膚科',
      doctor: '鈴木医師',
      phone1: '090-3333-3333',
      lastVisitDate: '2024/12/25',
      status: '通院中'
    },
    {
      id: '4',
      patientNo: 'P004',
      name: '高橋次郎',
      nameKana: 'タカハシジロウ',
      age: 55,
      gender: '男性',
      birthDate: '1969/01/15',
      department: '内科',
      doctor: '田中医師',
      phone1: '090-4444-4444',
      lastVisitDate: '2024/12/24',
      status: '通院中'
    },
    {
      id: '5',
      patientNo: 'P005',
      name: '小林美香',
      nameKana: 'コバヤシミカ',
      age: 28,
      gender: '女性',
      birthDate: '1996/03/22',
      department: '産婦人科',
      doctor: '佐藤医師',
      phone1: '090-5555-5555',
      lastVisitDate: '2024/12/24',
      status: '通院中'
    },
    {
      id: '6',
      patientNo: 'P006',
      name: '鈴木一郎',
      nameKana: 'スズキイチロウ',
      age: 58,
      gender: '男性',
      birthDate: '1966/04/12',
      department: '内科',
      doctor: '山田医師',
      phone1: '090-6666-6666',
      lastVisitDate: '2024/12/20',
      status: '通院中'
    },
    {
      id: '7',
      patientNo: 'P007',
      name: '渡辺由美',
      nameKana: 'ワタナベユミ',
      age: 42,
      gender: '女性',
      birthDate: '1982/09/10',
      department: '皮膚科',
      doctor: '鈴木医師',
      phone1: '090-7777-7777',
      lastVisitDate: '2024/12/21',
      status: '通院中'
    },
    {
      id: '8',
      patientNo: 'P008',
      name: '松本健一',
      nameKana: 'マツモトケンイチ',
      age: 67,
      gender: '男性',
      birthDate: '1957/12/05',
      department: '整形外科',
      doctor: '高橋医師',
      phone1: '090-8888-8888',
      lastVisitDate: '2024/12/24',
      status: '通院中'
    },
    {
      id: '9',
      patientNo: 'P009',
      name: '伊藤健太',
      nameKana: 'イトウケンタ',
      age: 35,
      gender: '男性',
      birthDate: '1989/06/18',
      department: '内科',
      doctor: '田中医師',
      phone1: '090-9999-9999',
      lastVisitDate: '2024/12/22',
      status: '通院中'
    },
    {
      id: '10',
      patientNo: 'P010',
      name: '中村幸子',
      nameKana: 'ナカムラサチコ',
      age: 51,
      gender: '女性',
      birthDate: '1973/08/25',
      department: '脳神経外科',
      doctor: '佐藤医師',
      phone1: '090-0000-0000',
      lastVisitDate: '2024/12/23',
      status: '通院中'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setSearchCriteria(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    setIsSearching(true);
    
    // 検索条件に基づいてフィルタリング
    const results = patientDatabase.filter(patient => {
      const matchesId = !searchCriteria.patientId || 
                       patient.patientNo.toLowerCase().includes(searchCriteria.patientId.toLowerCase()) ||
                       patient.id.includes(searchCriteria.patientId);
      
      const matchesKana = !searchCriteria.nameKana || 
                         patient.nameKana.includes(searchCriteria.nameKana);
      
      const matchesKanji = !searchCriteria.nameKanji || 
                          patient.name.includes(searchCriteria.nameKanji);
      
      const matchesBirthDate = !searchCriteria.birthDate || 
                              patient.birthDate.includes(searchCriteria.birthDate);
      
      return matchesId && matchesKana && matchesKanji && matchesBirthDate;
    });

    setTimeout(() => {
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const handleClearSearch = () => {
    setSearchCriteria({
      patientId: '',
      nameKana: '',
      nameKanji: '',
      birthDate: ''
    });
    setSearchResults([]);
  };

  const handleSelectPatient = (patient: Patient) => {
    onSelectPatient(patient);
    onClose();
  };

  const handleClose = () => {
    handleClearSearch();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] h-[80vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                患者検索
              </div>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col flex-1 min-h-0">
            {/* 検索条件入力部分 */}
            <div className="p-6 border-b bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label htmlFor="patient-id">患者ID</Label>
                  <Input
                    id="patient-id"
                    value={searchCriteria.patientId}
                    onChange={(e) => handleInputChange('patientId', e.target.value)}
                    placeholder="P001 または 1"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="name-kana">フリガナ</Label>
                  <Input
                    id="name-kana"
                    value={searchCriteria.nameKana}
                    onChange={(e) => handleInputChange('nameKana', e.target.value)}
                    placeholder="サトウ"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="name-kanji">氏名</Label>
                  <Input
                    id="name-kanji"
                    value={searchCriteria.nameKanji}
                    onChange={(e) => handleInputChange('nameKanji', e.target.value)}
                    placeholder="佐藤"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="birth-date">生年月日</Label>
                  <Input
                    id="birth-date"
                    value={searchCriteria.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    placeholder="1959/03/15"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleSearch} 
                  disabled={isSearching}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Search className="mr-2 h-4 w-4" />
                  {isSearching ? '検索中...' : '検索'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleClearSearch}
                >
                  クリア
                </Button>
              </div>
            </div>

            {/* 検索結果表示部分 */}
            <div className="flex-1 overflow-y-auto p-6">
              {searchResults.length > 0 ? (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium">検索結果 ({searchResults.length}件)</h3>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>患者ID</TableHead>
                          <TableHead>氏名</TableHead>
                          <TableHead>フリガナ</TableHead>
                          <TableHead>年齢</TableHead>
                          <TableHead>性別</TableHead>
                          <TableHead>生年月日</TableHead>
                          <TableHead>診療科</TableHead>
                          <TableHead>主治医</TableHead>
                          <TableHead>最終来院日</TableHead>
                          <TableHead>ステータス</TableHead>
                          <TableHead>操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {searchResults.map((patient) => (
                          <TableRow key={patient.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{patient.patientNo}</TableCell>
                            <TableCell>{patient.name}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{patient.nameKana}</TableCell>
                            <TableCell>{patient.age}歳</TableCell>
                            <TableCell>
                              <Badge variant={patient.gender === '男性' ? 'secondary' : 'outline'}>
                                {patient.gender}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">{patient.birthDate}</TableCell>
                            <TableCell>{patient.department}</TableCell>
                            <TableCell>{patient.doctor}</TableCell>
                            <TableCell className="text-sm">{patient.lastVisitDate}</TableCell>
                            <TableCell>
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                {patient.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button 
                                size="sm" 
                                onClick={() => handleSelectPatient(patient)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                選択
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    {searchCriteria.patientId || searchCriteria.nameKana || searchCriteria.nameKanji || searchCriteria.birthDate 
                      ? '該当する患者が見つかりませんでした' 
                      : '検索条件を入力して検索ボタンを押してください'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    患者ID、フリガナ、氏名、または生年月日で検索できます
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}