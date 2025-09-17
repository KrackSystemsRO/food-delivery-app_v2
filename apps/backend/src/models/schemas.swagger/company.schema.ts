export const Company = {
  $id: "Company",
  type: "object",
  properties: {
    _id: { type: "string" },
    admin: {
      type: "array",
      items: { $ref: "User#" },
    },
    name: {
      type: "string",
      minLength: 3,
      maxLength: 100,
    },
    address: { type: "string" },
    type: { type: "string" },
    email: {
      type: "string",
      format: "email",
    },
    is_active: { type: "boolean", default: false },
    phone_number: {
      type: "string",
    },
    createdAt: {
      type: "string",
      format: "date-time",
    },
    updatedAt: {
      type: "string",
      format: "date-time",
    },
    companyId: {
      type: "integer",
    },
    __v: {
      type: "integer",
    },
  },
};

export const CompanyResponse = {
  $id: "CompanyResponse",
  type: "object",
  properties: {
    status: { type: "number" },
    message: { type: "string" },
    result: { $ref: "Company#" },
  },
};

export const CompaniesResponse = {
  $id: "CompaniesResponse",
  type: "object",
  properties: {
    status: { type: "integer", example: 200 },
    message: { type: "string", example: "Companies retrieved successfully!" },
    result: {
      type: "array",
      items: { $ref: "Company#" },
    },
  },
};
