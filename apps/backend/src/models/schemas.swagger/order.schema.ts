export const Order = {
  $id: "Order",
  type: "object",
  properties: {
    _id: { type: "string" },
    orderId: { type: "integer" },
    user: { $ref: "UserShort#" },
    store: { $ref: "StoreShort#" }, // changed from restaurant to store for consistency
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          product: { $ref: "ProductShort#" },
          quantity: { type: "number", minimum: 1 },
        },
        required: ["product", "quantity"],
        additionalProperties: false,
      },
      minItems: 1,
    },
    total: { type: "number", minimum: 0 },
    status: {
      type: "string",
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "on_the_way",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    deliveryLocation: {
      type: "object",
      properties: {
        lat: { type: "number" },
        lng: { type: "number" },
        address: { type: "string" },
      },
      required: ["lat", "lng", "address"],
      nullable: true, // make deliveryLocation optional
    },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    __v: { type: "integer" },
  },
  required: [
    "_id",
    "user",
    "store",
    "items",
    "total",
    "status",
    "createdAt",
    "updatedAt",
  ],
  additionalProperties: false,
};

export const OrderResponse = {
  $id: "OrderResponse",
  type: "object",
  properties: {
    status: { type: "number", example: 200 },
    message: { type: "string", example: "Order fetched successfully!" },
    result: { $ref: "Order#" },
  },
};

export const OrdersResponse = {
  $id: "OrdersResponse",
  type: "object",
  properties: {
    status: { type: "number", example: 200 },
    message: { type: "string", example: "Orders fetched successfully!" },
    result: {
      type: "array",
      items: { $ref: "Order#" },
    },
  },
};

export const UpdateOrderResponse = {
  $id: "UpdateOrderResponse",
  type: "object",
  properties: {
    status: { type: "number" },
    result: { $ref: "Order#" },
    message: { type: "string" },
  },
};
