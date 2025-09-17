export const User = {
  $id: "User",
  type: "object",
  properties: {
    _id: { type: "string" },
    first_name: { type: "string" },
    last_name: { type: "string" },
    email: { type: "string" },
    role: { type: "string" },
    phone_number: { type: "string" },
    is_active: { type: "boolean" },
    company: {
      type: "array",
      items: { $ref: "Company#" },
    },
    department: {
      type: "array",
      items: { $ref: "Department#" },
    },
    deliveryLocations: {
      type: "array",
      items: { type: "string" },
    },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    userId: { type: "integer" },
    __v: { type: "integer" },
  },
  additionalProperties: false,
};

export const UserResponse = {
  $id: "UserResponse",
  type: "object",
  properties: {
    status: { type: "number" },
    result: { $ref: "User#" },
  },
};

export const UpdateUserResponse = {
  $id: "UpdateUserResponse",
  type: "object",
  properties: {
    status: { type: "number" },
    result: { $ref: "User#" },
    message: { type: "string" },
  },
};

export const UsersResponse = {
  $id: "UsersResponse",
  type: "object",
  properties: {
    status: { type: "integer", example: 200 },
    message: { type: "string", example: "Users retrieved successfully!" },
    result: {
      type: "array",
      items: { $ref: "User#" },
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

export const DeliveryLocation = {
  $id: "DeliveryLocation",
  type: "object",
  properties: {
    label: { type: "string" },
    address: { type: "string" },
    lat: { type: "number" },
    lng: { type: "number" },
  },
};

export const UserShort = {
  $id: "UserShort",
  type: "object",
  properties: {
    _id: { type: "string" },
    first_name: { type: "string" },
    last_name: { type: "string" },
    email: { type: "string" },
  },
};
