import React from 'react';
import { User, X } from 'lucide-react';
import { Input } from '@/shared/components/atoms/input';
import { Patient } from '../../src/types/patient';

interface PatientSelectorProps {
  selectedPatient: Patient | null;
  onSelectPatient: (patient: Patient | null) => void;
  disabled?: boolean;
  patients: Patient[];
}

export function PatientSelector({
  selectedPatient,
  onSelectPatient,
  disabled = false,
  patients
}: PatientSelectorProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSearchResults, setShowSearchResults] = React.useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
  };

  const searchResults = searchQuery.length > 0
    ? patients.filter(p => 
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name.includes(searchQuery) ||
        p.kana.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const selectPatient = (patient: Patient) => {
    onSelectPatient(patient);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const clearSelection = () => {
    onSelectPatient(null);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  return (
    <div className="relative">
      {/* 患者選択後：シンプルな固定表示 */}
      {selectedPatient ? (
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <User className="w-4 h-4" />
          </div>
          <Input
            type="text"
            value={`${selectedPatient.name} (ID: ${selectedPatient.id})`}
            disabled
            className="pl-10 pr-10 bg-gray-100 border-gray-300"
          />
          {!disabled && (
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={clearSelection}
              title="選択を解除"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {/* 患者未選択時：検索フィールド */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <User className="w-4 h-4" />
            </div>
            <Input
              type="text"
              placeholder="患者ID、氏名、カナで検索"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery.length > 0 && setShowSearchResults(true)}
              disabled={disabled}
              className="pl-10 bg-white border-gray-300"
            />
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {searchResults.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => selectPatient(patient)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="text-sm text-gray-900">{patient.name}</div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    ID: {patient.id} / {patient.kana}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {patient.birthDate} / {patient.gender}
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {showSearchResults && searchResults.length === 0 && searchQuery.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-sm text-gray-500">
              該当する患者が見つかりません
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Re-export Patient type for convenience
export type { Patient };