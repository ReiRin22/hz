'use client';
import { Eye, EyeOff, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/atoms/avatar";
import { Badge } from "@/shared/components/atoms/badge";

type PatientAvatarMoleculeProps = {
  name: string;
  kana: string;
  patientId: string;
  gender: string;
  isPrivacyMode: boolean;
  onPrivacyToggle: () => void;
  onPatientIdClick: () => void;
};

function getGenderColor(gender: string) {
  return gender === "男性" ? "medical-primary" : "bg-pink-500";
}

function getInitials(name: string) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0] ?? '').join('').toUpperCase();
}

export function PatientAvatarMolecule({
  name,
  kana,
  patientId,
  gender,
  isPrivacyMode,
  onPrivacyToggle,
  onPatientIdClick,
}: PatientAvatarMoleculeProps) {
  return (
    <div className="flex items-center space-x-4">
      <button
        type="button"
        className="relative cursor-pointer group border-0 bg-transparent p-0"
        onClick={onPrivacyToggle}
        aria-label={isPrivacyMode ? "個人情報を表示する" : "個人情報を非表示にする"}
      >
        <Avatar className={`w-16 h-16 ${getGenderColor(gender)} border-4 border-white dark:border-gray-800 shadow-lg transition-all ${isPrivacyMode ? 'blur-sm' : ''}`}>
          <AvatarFallback className="text-white text-lg font-bold">
            {isPrivacyMode ? '?' : getInitials(name)}
          </AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {isPrivacyMode ? (
            <Eye className="w-8 h-8 text-white" />
          ) : (
            <EyeOff className="w-8 h-8 text-white" />
          )}
        </div>
      </button>

      <div className="flex flex-col">
        <div className="mt-2 mb-1 flex items-center space-x-2">
          <button
            type="button"
            className="inline-flex items-center text-[12px] rounded-md border px-2 py-0.5 font-medium medical-border-primary medical-text-primary medical-bg-primary cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            onClick={onPatientIdClick}
            aria-label={`患者ID ${patientId} で患者を検索する`}
          >
            <Search className="w-3 h-3 mr-1 text-blue-700 dark:text-blue-300" />
            ID: {patientId}
          </button>
          {isPrivacyMode && (
            <Badge className="bg-yellow-500 text-white text-[12px] animate-pulse">
              VIP患者
            </Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground font-medium">
          {isPrivacyMode ? '●●●●●●' : kana}
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {isPrivacyMode ? '匿名患者' : name}
        </div>
      </div>
    </div>
  );
}
