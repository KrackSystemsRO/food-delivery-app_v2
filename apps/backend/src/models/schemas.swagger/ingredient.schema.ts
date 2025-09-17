export const Ingredient = {
  $id: "Ingredient",
  type: "object",
  properties: {
    _id: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    allergens: {
      type: "array",
      items: { $ref: "Allergen#" },
      default: [],
    },
    nutritionalInfo: {
      type: "object",
      properties: {
        calories: { type: "number", default: 0 },
        protein: { type: "number", default: 0 },
        fat: { type: "number", default: 0 },
        fiber: { type: "number", default: 0 },
        sugar: { type: "number", default: 0 },
      },
      additionalProperties: false,
      default: {},
    },
    unit: { type: "string" },
    is_active: { type: "boolean" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    ingredientId: { type: "number" },
    __v: { type: "integer" },
  },
  required: ["_id"],
  additionalProperties: false,
};

export const IngredientResponse = {
  $id: "IngredientResponse",
  type: "object",
  properties: {
    status: { type: "number", example: 200 },
    result: { $ref: "Ingredient#" },
  },
};

export const UpdateIngredientResponse = {
  $id: "UpdateIngredientResponse",
  type: "object",
  properties: {
    status: { type: "number", example: 200 },
    result: { $ref: "Ingredient#" },
    message: { type: "string", example: "Ingredient updated successfully!" },
  },
};

export const IngredientsResponse = {
  $id: "IngredientsResponse",
  type: "object",
  properties: {
    status: { type: "integer", example: 200 },
    message: { type: "string", example: "Ingredients retrieved successfully!" },
    result: {
      type: "array",
      items: { $ref: "Ingredient#" },
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
