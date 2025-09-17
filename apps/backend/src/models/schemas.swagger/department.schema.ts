export const Department = {
  $id: "Department",
  type: "object",
  properties: {
    _id: { type: "string" },
    company: {
      type: "array",
      items: { $ref: "Company#" },
    },
    admin: {
      type: "array",
      items: { $ref: "User#" },
    },
    name: {
      type: "string",
      minLength: 3,
      maxLength: 100,
    },
    description: {
      type: "string",
    },
    is_active: {
      type: "boolean",
      default: false,
    },
    createdAt: {
      type: "string",
      format: "date-time",
    },
    updatedAt: {
      type: "string",
      format: "date-time",
    },
    departmentId: {
      type: "integer",
    },
    __v: {
      type: "integer",
    },
  },
};

export const DepartmentResponse = {
  $id: "DepartmentResponse",
  type: "object",
  properties: {
    status: { type: "number", example: 200 },
    result: { $ref: "Department#" },
    message: { type: "string" },
  },
};

export const DepartmentsResponse = {
  $id: "DepartmentsResponse",
  type: "object",
  properties: {
    status: { type: "number", example: 200 },
    message: { type: "string", example: "Departments retrieved successfully!" },
    result: {
      type: "array",
      items: { $ref: "Department#" },
    },
    totalCount: { type: "number" },
    totalPages: { type: "number" },
    currentPage: { type: "number" },
  },
};
