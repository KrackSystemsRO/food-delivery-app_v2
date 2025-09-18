export interface CategoryType {
  _id: string;
  name: string;
  description?: string;
  is_active?: boolean;
  categoryId?: number;
  createdAt?: string;
  updatedAt?: string;
  __v: number;
}

export interface CategoryForm {
  name: string;
  description?: string;
  is_active?: boolean;
}
