'use client';

import { useState, useCallback } from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/shared/components/atoms/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/atoms/alert-dialog';
import { toast } from 'sonner';
import { usePatientInfoTabs } from './hooks/usePatientInfoTabs';
import { TAB_LABELS, READ_ONLY_TABS } from './constants/tabConfig';
import type { TabId } from './constants/tabConfig';
import type { PatientInfoData, UserRole } from './types/patientInfo.type';
import { BasicInfoTab } from './components/organisms/BasicInfoTab';
import { AllergyHistoryTab } from './components/organisms/AllergyHistoryTab';
import { VaccinationTab } from './components/organisms/VaccinationTab';
import { FamilyInfoTab } from './components/organisms/FamilyInfoTab';
import { InfectionTab } from './components/organisms/InfectionTab';
import { ImplantDeviceTab } from './components/organisms/ImplantDeviceTab';
import { LifestyleTab } from './components/organisms/LifestyleTab';
import { MedicalMemoTab } from './components/organisms/MedicalMemoTab';
import { PhilosophyTab } from './components/organisms/PhilosophyTab';
import { AccessControlTab } from './components/organisms/AccessControlTab';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.patientInfo.patientInfoTabsFeature;

interface PatientInfoTabsFeatureProps {
  initialData: PatientInfoData;
  userRole: UserRole;
}

export function PatientInfoTabsFeature({ initialData, userRole }: PatientInfoTabsFeatureProps) {
  const { activeTab, accessibleTabs, cancelDialogOpen, handleTabChange, openCancelDialog, closeCancelDialog } =
    usePatientInfoTabs(userRole);

  const [basicInfoDraft, setBasicInfoDraft] = useState(initialData.basicInfo);
  // TODO: BFF 実装時に各タブ（allergyHistory・vaccination 等）の変更検知を isDirty に統合すること
  // 現時点では basicInfo タブの変更のみを検知している
  const [isDirty, setIsDirty] = useState(false);

  const handleBasicInfoChange = useCallback(
    (record: PatientInfoData['basicInfo']) => {
      setBasicInfoDraft(record);
      setIsDirty(true);
    },
    [],
  );

  const handleSave = useCallback(() => {
    // TODO: BFF 実装後はfetch に置換
    setIsDirty(false);
    toast.success(t.saveSuccess);
  }, []);

  const handleCancelClick = useCallback(() => {
    if (isDirty) {
      openCancelDialog();
    } else {
      toast.info(t.noChanges);
    }
  }, [isDirty, openCancelDialog]);

  const handleCancelConfirm = useCallback(() => {
    setBasicInfoDraft(initialData.basicInfo);
    setIsDirty(false);
    closeCancelDialog();
    toast.info(t.cancelDone);
  }, [initialData.basicInfo, closeCancelDialog]);

  const isTabReadOnly = (tabId: TabId): boolean => {
    const readOnlyRoles = READ_ONLY_TABS[tabId];
    return readOnlyRoles?.includes(userRole) ?? false;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center px-4 py-3 border-b bg-background shrink-0">
        <h2 className="text-base font-semibold">{t.title}</h2>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => {
          if (accessibleTabs.includes(v as TabId)) {
            handleTabChange(v as TabId);
          }
        }}
        className="flex flex-col flex-1 overflow-hidden"
      >
        <TabsList className="shrink-0 !h-auto !w-full rounded-none border-b bg-background py-1">
          {accessibleTabs.map((tabId) => (
            <TabsTrigger key={tabId} value={tabId} className="flex-1 text-xs whitespace-nowrap">
              {TAB_LABELS[tabId]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="basicInfo" className="flex-1 overflow-y-auto">
          <BasicInfoTab record={basicInfoDraft} onChange={handleBasicInfoChange} />
        </TabsContent>

        <TabsContent value="allergyHistory" className="flex-1 overflow-y-auto">
          <AllergyHistoryTab data={initialData.allergyHistory} isReadOnly={isTabReadOnly('allergyHistory')} />
        </TabsContent>

        <TabsContent value="vaccination" className="flex-1 overflow-y-auto">
          <VaccinationTab records={initialData.vaccinations} isReadOnly={isTabReadOnly('vaccination')} />
        </TabsContent>

        <TabsContent value="familyInfo" className="flex-1 overflow-y-auto">
          <FamilyInfoTab data={initialData.familyInfo} isReadOnly={isTabReadOnly('familyInfo')} />
        </TabsContent>

        <TabsContent value="infection" className="flex-1 overflow-y-auto">
          <InfectionTab records={initialData.infections} isReadOnly={isTabReadOnly('infection')} />
        </TabsContent>

        <TabsContent value="implantDevice" className="flex-1 overflow-y-auto">
          <ImplantDeviceTab data={initialData.implantDevices} isReadOnly={isTabReadOnly('implantDevice')} />
        </TabsContent>

        <TabsContent value="lifestyle" className="flex-1 overflow-y-auto">
          <LifestyleTab record={initialData.lifestyle} isReadOnly={isTabReadOnly('lifestyle')} />
        </TabsContent>

        <TabsContent value="medicalMemo" className="flex-1 overflow-y-auto">
          <MedicalMemoTab records={initialData.medicalMemos} isReadOnly={isTabReadOnly('medicalMemo')} />
        </TabsContent>

        <TabsContent value="philosophy" className="flex-1 overflow-y-auto">
          <PhilosophyTab records={initialData.philosophies} isReadOnly={isTabReadOnly('philosophy')} />
        </TabsContent>

        {accessibleTabs.includes('accessControl') && (
          <TabsContent value="accessControl" className="flex-1 overflow-y-auto">
            <AccessControlTab data={initialData.accessControl} />
          </TabsContent>
        )}
      </Tabs>

      <div className="flex items-center justify-end px-4 py-3 border-t bg-background shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background text-xs font-medium px-3 h-8 shadow-sm hover:bg-accent transition-colors"
            onClick={handleCancelClick}
          >
            {t.cancelBtn}
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-medium px-3 h-8 shadow-sm hover:bg-primary/90 transition-colors"
            onClick={handleSave}
          >
            {t.saveBtn}
          </button>
        </div>
      </div>

      {/* キャンセル確認ダイアログ */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={(open) => { if (!open) closeCancelDialog(); }}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>{t.cancelDialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>{t.cancelDialogDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeCancelDialog}>{t.cancelDialogBack}</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelConfirm}>{t.cancelDialogConfirm}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
