import mongoose from "mongoose";

const mockProductData = {
  _id: new mongoose.Types.ObjectId(),
  productId: 1,
  restaurant: new mongoose.Types.ObjectId(),
  name: "Mock Product",
  description: "Mock Description",
  price: 9.99,
  image: "https://example.com/image.jpg",
  available: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  toObject() {
    return { ...this };
  },
};

const mockSave = jest.fn().mockResolvedValue(mockProductData);

function MockProduct(this: any, data: any) {
  Object.assign(this, {
    ...mockProductData,
    ...data,
    _id: new mongoose.Types.ObjectId(),
    save: mockSave,
    toObject: () => ({ ...this }),
  });
}

// Mock static methods
MockProduct.findOne = jest.fn();
MockProduct.findById = jest.fn();
MockProduct.find = jest.fn();
MockProduct.findOneAndUpdate = jest.fn();
MockProduct.deleteOne = jest.fn();
MockProduct.create = jest.fn().mockResolvedValue(mockProductData);

export { mockProductData, mockSave };
export default MockProduct;
