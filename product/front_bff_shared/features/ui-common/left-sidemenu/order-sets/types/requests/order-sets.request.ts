export interface CreateMySetRequest {
  name: string;
  description?: string;
  items: string[];
}

export type GetCompositeSetsOrderType = "prescription" | "injection" | "lab";
