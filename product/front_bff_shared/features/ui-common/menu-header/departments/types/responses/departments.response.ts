export interface DepartmentResponse {
  id: string;
  name: string;
}

export interface GetDepartmentsResponse {
  departments: DepartmentResponse[];
}
