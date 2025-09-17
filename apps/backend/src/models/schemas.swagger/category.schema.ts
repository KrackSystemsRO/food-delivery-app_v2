export const Category = {
  $id: "Category",
  type: "object",
  properties: {
    _id: { type: "string" },
    categoryId: { type: "string" },
    name: { type: "string", example: "Beverages" },
    description: {
      type: "string",
      example: "All types of drinks, both alcoholic and non-alcoholic",
    },
    is_active: { type: "boolean", example: true },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    __v: { type: "integer" },
  },
  additionalProperties: false,
};

export const CategoryResponse = {
  $id: "CategoryResponse",
  type: "object",
  properties: {
    status: { type: "number", example: 200 },
    message: { type: "string" },
    result: { $ref: "Category#" },
  },
};

export const UpdateCategoryResponse = {
  $id: "UpdateCategoryResponse",
  type: "object",
  properties: {
    status: { type: "number", example: 200 },
    result: { $ref: "Category#" },
    message: { type: "string", example: "Category updated successfully!" },
  },
};

export const CategoriesResponse = {
  $id: "CategoriesResponse",
  type: "object",
  properties: {
    status: { type: "integer", example: 200 },
    message: { type: "string", example: "Categories retrieved successfully!" },
    result: {
      type: "array",
      items: { $ref: "Category#" },
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
