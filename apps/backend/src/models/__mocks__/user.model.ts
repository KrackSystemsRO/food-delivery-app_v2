import mongoose from "mongoose";

const mockUserData = {
  _id: new mongoose.Types.ObjectId(),
  userId: 1,
  first_name: "Test",
  last_name: "User",
  email: "test@example.com",
  role: "ADMIN",
  phone_number: "+1234567890",
  is_active: true,
  password: "hashedPassword",
  company: [new mongoose.Types.ObjectId()],
  department: [new mongoose.Types.ObjectId()],
  resetToken: "mockResetToken",
  resetTokenExpires: new Date(Date.now() + 3600000), // 1 hour in future
  deliveryLocations: [
    {
      label: "Home",
      address: "123 Test St",
      lat: 40.7128,
      lng: -74.006,
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
  toObject() {
    return { ...this };
  },
};

const mockSave = jest.fn().mockResolvedValue(mockUserData);

function MockUser(this: any, data: any) {
  Object.assign(this, {
    ...mockUserData,
    ...data,
    _id: new mongoose.Types.ObjectId(),
    userId: data?.userId || 999,
    save: mockSave,
    toObject: () => ({ ...this }),
  });
}

// Mock static methods on the model
MockUser.findOne = jest.fn();
MockUser.findById = jest.fn();
MockUser.findOneAndUpdate = jest.fn();
MockUser.deleteOne = jest.fn();
MockUser.find = jest.fn();
MockUser.create = jest.fn().mockResolvedValue(mockUserData);

export { mockUserData, mockSave };
export default MockUser;
