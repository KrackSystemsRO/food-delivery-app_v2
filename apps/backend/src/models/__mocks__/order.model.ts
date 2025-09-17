import mongoose from "mongoose";

const mockOrderData = {
  _id: new mongoose.Types.ObjectId(),
  orderId: 1,
  user: new mongoose.Types.ObjectId(),
  restaurant: new mongoose.Types.ObjectId(),
  items: [
    {
      product: new mongoose.Types.ObjectId(),
      quantity: 2,
    },
  ],
  total: 19.98,
  status: "pending",
  deliveryLocation: {
    lat: 37.7749,
    lng: -122.4194,
    address: "123 Mock Street",
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  toObject() {
    return { ...this };
  },
};

const mockSave = jest.fn().mockResolvedValue(mockOrderData);

function MockOrder(this: any, data: any) {
  Object.assign(this, {
    ...mockOrderData,
    ...data,
    _id: new mongoose.Types.ObjectId(),
    orderId: Math.floor(Math.random() * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
    save: mockSave,
    toObject: () => ({ ...this }),
  });
}

MockOrder.findOne = jest.fn();
MockOrder.findById = jest.fn();
MockOrder.find = jest.fn();
MockOrder.findOneAndUpdate = jest.fn();
MockOrder.deleteOne = jest.fn();
MockOrder.create = jest.fn().mockResolvedValue(mockOrderData);

export { mockOrderData, mockSave };
export default MockOrder;
