export interface CategoryType {
  _id: string;
  categoryId?: string;
  name: string;
  description?: string;
  is_active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CategoryForm {
  name: string;
  description?: string;
  is_active?: boolean;
}
