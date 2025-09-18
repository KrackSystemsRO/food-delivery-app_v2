export interface AllergenType {
    _id: string;
    allergenId?: number;
    name: string;
    description?: string;
    is_active?: boolean;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}
export interface AllergenForm {
    name: string;
    description?: string;
    is_active?: boolean;
}
