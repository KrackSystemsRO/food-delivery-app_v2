export const Recipe = {
  $id: "Recipe",
  type: "object",
  properties: {
    _id: { type: "string" },
    recipeId: { type: "number" },
    name: { type: "string" },
    description: { type: "string" },
    ingredients: {
      type: "array",
      items: { $ref: "RecipeIngredient#" },
      default: [],
    },
  },
  required: ["_id", "ingredients"],
  additionalProperties: false,
};

export const RecipeIngredient = {
  $id: "RecipeIngredient",
  type: "object",
  properties: {
    ingredient: { $ref: "Ingredient#" },
    quantity: { type: "string" },
  },
  required: ["ingredient"],
  additionalProperties: false,
};

export const RecipeResponse = {
  $id: "RecipeResponse",
  type: "object",
  properties: {
    status: { type: "number", example: 200 },
    message: { type: "string" },
    result: { $ref: "Recipe#" },
  },
};

export const UpdateRecipeResponse = {
  $id: "UpdateRecipeResponse",
  type: "object",
  properties: {
    status: { type: "number", example: 200 },
    result: { $ref: "Recipe#" },
    message: { type: "string", example: "Recipe updated successfully!" },
  },
};

export const RecipesResponse = {
  $id: "RecipesResponse",
  type: "object",
  properties: {
    status: { type: "integer", example: 200 },
    message: { type: "string", example: "Recipes retrieved successfully!" },
    result: {
      type: "array",
      items: { $ref: "Recipe#" },
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
