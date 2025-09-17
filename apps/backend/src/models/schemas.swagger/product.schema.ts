export const EnergeticValues = {
  $id: "EnergeticValues",
  type: "object",
  properties: {
    calories: { type: "number", default: 0 },
    protein: { type: "number", default: 0 },
    fat: { type: "number", default: 0 },
    fiber: { type: "number", default: 0 },
    sugar: { type: "number", default: 0 },
  },
  additionalProperties: false,
};

// export const Recipe = {
//   $id: "Recipe",
//   type: "object",
//   properties: {
//     _id: { type: "string" },
//     name: { type: "string" },
//     description: { type: "string" },
//     ingredients: {
//       type: "array",
//       items: { $ref: "Ingredient#" },
//       default: [],
//     },
//   },
//   required: ["_id", "name", "ingredients"],
//   additionalProperties: false,
// };

export const Product = {
  $id: "Product",
  type: "object",
  properties: {
    _id: { type: "string" },
    productId: { type: "integer" },
    name: { type: "string" },
    description: { type: "string" },
    price: { type: "number" },
    image: { type: "string" },
    store: {
      type: "object",
      properties: {
        _id: { type: "string" },
        name: { type: "string" },
        type: { type: "string" },
      },
      required: ["_id", "name", "type"],
    },
    available: { type: "boolean" },
    category: {
      type: ["array", "null"],
      properties: {
        _id: { type: "string" },
        name: { type: "string" },
        description: { type: "string" },
      },
      required: ["_id", "name"],
      nullable: true,
    },
    recipe: {
      type: ["object", "null"],
      properties: {
        _id: { type: "string" },
        name: { type: "string" },
        description: { type: "string" },
        ingredients: {
          type: "array",
          items: {
            type: "object",
            properties: {
              quantity: { type: "string" },
              unit: { type: "string" },
              ingredient: {
                type: ["object", "null"],
                properties: {
                  _id: { type: "string" },
                  name: { type: "string" },
                  description: { type: "string" },
                  is_active: { type: "boolean" },
                  nutritionalInfo: { type: "string" },
                  allergens: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        _id: { type: "string" },
                        name: { type: "string" },
                        description: { type: "string" },
                      },
                      required: ["_id", "name"],
                    },
                  },
                },
                required: ["_id", "name"],
                nullable: true,
              },
            },
            required: ["ingredient"],
          },
        },
      },
      required: ["_id", "name", "ingredients"],
      nullable: true,
    },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    __v: { type: "integer" },
  },
  required: [
    "_id",
    "name",
    "price",
    "available",
    "productId",
    "store",
    "createdAt",
    "updatedAt",
  ],
  additionalProperties: false,
};

export const ProductResponse = {
  $id: "ProductResponse",
  type: "object",
  properties: {
    status: { type: "number", example: 200 },
    result: { $ref: "Product#" },
  },
  required: ["status", "result"],
};

export const ProductsResponse = {
  $id: "ProductsResponse",
  type: "object",
  properties: {
    status: { type: "number", example: 200 },
    message: { type: "string", example: "Products fetched successfully!" },
    result: {
      type: "array",
      items: { $ref: "Product#" },
    },
  },
  required: ["status", "message", "result"],
};

export const UpdateProductResponse = {
  $id: "UpdateProductResponse",
  type: "object",
  properties: {
    status: { type: "number" },
    result: { $ref: "Product#" },
    message: { type: "string" },
  },
  required: ["status", "result", "message"],
};

export const ProductShort = {
  $id: "ProductShort",
  type: "object",
  properties: {
    _id: { type: "string" },
    name: { type: "string" },
    image: { type: "string" },
    available: { type: "boolean" },
  },
  required: ["_id", "name", "available"],
  additionalProperties: false,
};
