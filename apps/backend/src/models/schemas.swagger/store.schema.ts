export const Store = {
  $id: "Store",
  type: "object",
  properties: {
    _id: { type: "string" },

    company: {
      type: "array",
      items: {
        $ref: "Company#",
      },
    },

    admin: {
      type: "array",
      items: {
        $ref: "User#",
      },
    },

    name: {
      type: "string",
      minLength: 5,
      maxLength: 50,
    },

    phone_number: {
      type: "string",
      pattern: "^\\+?[1-9]\\d{1,14}$",
    },

    description: { type: "string" },

    type: { type: "string" },

    address: { type: "string" },

    is_open: { type: "boolean" },

    is_active: { type: "boolean" },

    storeId: { type: "integer" },

    location: {
      type: "object",
      properties: {
        lat: { type: ["number", "null"], nullable: true },
        lng: { type: ["number", "null"], nullable: true },
      },
      required: ["lat", "lng"],
      additionalProperties: false,
    },

    createdAt: { type: "string", format: "date-time" },

    updatedAt: { type: "string", format: "date-time" },

    __v: { type: "integer" },
  },
  required: [
    "_id",
    "company",
    "admin",
    "name",
    "phone_number",
    "description",
    "address",
    "is_open",
    "is_active",
    "storeId",
    "location",
    "createdAt",
    "updatedAt",
    "__v",
  ],
  additionalProperties: false,
};

export const StoreResponse = {
  $id: "StoreResponse",
  type: "object",
  properties: {
    status: { type: "number", example: 200 },
    message: { type: "string", example: "Store fetched successfully!" },
    result: { $ref: "Store#" },
  },
};

export const StoresResponse = {
  $id: "StoresResponse",
  type: "object",
  properties: {
    status: { type: "integer", example: 200 },
    message: { type: "string", example: "Stores fetched successfully!" },
    result: {
      type: "array",
      items: { $ref: "Store#" },
    },
    totalCount: { type: "integer", example: 50 },
    totalPages: { type: "integer", example: 5 },
    currentPage: { type: "integer", example: 1 },
  },
  required: [
    "status",
    "message",
    "result",
    "totalCount",
    "totalPages",
    "currentPage",
  ],
};

export const StoreShort = {
  $id: "StoreShort",
  type: "object",
  properties: {
    _id: { type: "string" },
    name: { type: "string" },
    is_open: { type: "boolean" },
  },
};
