// バックエンド（.NET）は JsonNamingPolicy.CamelCase で応答するため camelCase で定義
export type BackendTestResultRecord = {
  itemCode: string;
  itemName: string;
  resultValue: number | null;
  unit: string;
  referenceValueDisplay: string | null;
  lowerLimit: number | null;
  upperLimit: number | null;
  criticalLower: number | null;
  criticalUpper: number | null;
  previousResultValue: number | null;
  hasPreviousResult: boolean;
  testDate: string | null;
  hasTestDate: boolean;
  isUserAdded: boolean;
};

export type BackendTestResultsGetResponse = {
  orderUuid: string;
  hasConfirmedResults: boolean;
  testResults: BackendTestResultRecord[];
};

export type BackendLockAcquireResponse = {
  lockId: string;
  lockedAt: string;
  expiresAt: string;
};

export type BackendUnitRecord = {
  code: string;
  name: string;
};

export type BackendUnitsGetResponse = {
  units: BackendUnitRecord[];
};

export type BackendModificationReasonRecord = {
  code: string;
  name: string;
};

export type BackendModificationReasonsGetResponse = {
  reasons: BackendModificationReasonRecord[];
};

export type BackendSaveResponse = {
  orderUuid: string;
  savedAt: string;
};

export type BackendSaveErrorBody = {
  errorCode?: string;
  lockedByUserName?: string;
};
