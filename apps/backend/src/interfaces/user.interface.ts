export interface DeliveryLocationInput {
  label: string;
  address: string;
  city?: string;
  postal_code?: string;
  lat?: number;
  lng?: number;
  is_default?: boolean;
}

export interface VehicleInfoInput {
  type?: "bike" | "car" | "scooter";
  plate_number?: string;
  capacity?: string;
}
