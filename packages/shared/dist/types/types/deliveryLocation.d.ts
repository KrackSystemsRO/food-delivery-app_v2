export interface DeliveryLocation {
    _id?: string;
    locationId?: number;
    label: string;
    address: string;
    city?: string;
    postal_code?: string;
    lat?: number;
    lng?: number;
    is_default?: boolean;
}
export interface AddDeliveryLocationPayload {
    label: string;
    address: string;
    city?: string;
    postal_code?: string;
    lat?: number;
    lng?: number;
    is_default?: boolean;
}
export type UpdateDeliveryLocationPayload = Partial<DeliveryLocation>;
