export interface CompanyType {
  _id: string;
  name: string;
  type: string;
  is_active: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  companyId: number;
  __v: number;
  admin: any[]; // Replace with actual admin type if available
}
