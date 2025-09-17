export const Allergen = {
  $id: "Allergen",
  type: "object",
  properties: {
    _id: { type: "string" },
    allergenId: { type: "number" },
    name: { type: "string", example: "Peanuts" },
    description: {
      type: "string",
      example: "Contains peanuts or peanut products",
    },
    is_active: { type: "boolean", example: true },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    __v: { type: "integer" },
  },
  additionalProperties: false,
};

export const AllergenResponse = {
  $id: "AllergenResponse",
  type: "object",
  properties: {
    status: { type: "number", example: 200 },
    message: { type: "string" },
    result: { $ref: "Allergen#" },
  },
};

export const UpdateAllergenResponse = {
  $id: "UpdateAllergenResponse",
  type: "object",
  properties: {
    status: { type: "number", example: 200 },
    result: { $ref: "Allergen#" },
    message: { type: "string", example: "Allergen updated successfully!" },
  },
};

export const AllergensResponse = {
  $id: "AllergensResponse",
  type: "object",
  properties: {
    status: { type: "integer", example: 200 },
    message: { type: "string", example: "Allergens retrieved successfully!" },
    result: {
      type: "array",
      items: { $ref: "Allergen#" },
    },
    totalCount: { type: "integer", example: 100 },
    totalPages: { type: "integer", example: 10 },
    currentPage: { type: "integer", example: 1 },
  },
  required: [
    "status",
    "result",
    "totalCount",
    "totalPages",
    "currentPage",
    "message",
  ],
};
