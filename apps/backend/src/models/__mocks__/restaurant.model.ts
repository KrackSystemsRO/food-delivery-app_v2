import mongoose from "mongoose";

const mockRestaurantData = {
  _id: new mongoose.Types.ObjectId(),
  restaurantId: 1,
  owner: [new mongoose.Types.ObjectId()],
  name: "Test Restaurant",
  description: "Delicious food served here.",
  address: "456 Food St",
  is_open: false,
  is_active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  toObject() {
    return { ...this };
  },
};

const mockSave = jest.fn().mockResolvedValue(mockRestaurantData);

function MockRestaurant(this: any, data: any) {
  Object.assign(this, {
    ...data,
    _id: new mongoose.Types.ObjectId(),
    restaurantId: data.restaurantId || 999,
    save: mockSave,
    toObject: () => ({ ...data }),
  });
}

MockRestaurant.findOne = jest.fn();
MockRestaurant.findById = jest.fn();
MockRestaurant.findOneAndUpdate = jest.fn();
MockRestaurant.findOneAndDelete = jest.fn();
MockRestaurant.deleteOne = jest.fn();
MockRestaurant.find = jest.fn();
MockRestaurant.create = jest.fn().mockResolvedValue(mockRestaurantData);

export { mockRestaurantData, mockSave };
export default MockRestaurant;
