import mongoose from "mongoose";
import { mockCompanyData } from "./company.model";
import { mockUserData } from "./user.model";

const mockDepartmentData = {
  _id: new mongoose.Types.ObjectId(),
  departmentId: 1,
  company: "companyId123",
  admin: mockUserData._id,
  name: "Marketing",
  is_active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  toObject() {
    return this;
  },
};

const mockSave = jest.fn().mockResolvedValue(mockDepartmentData);

function MockDepartment(this: any, data: any) {
  Object.assign(this, {
    ...data,
    _id: new mongoose.Types.ObjectId(),
    departmentId: data.departmentId || 999,
    save: mockSave,
    toObject: () => ({ ...data }),
  });
}

MockDepartment.findOne = jest.fn();
MockDepartment.findById = jest.fn();
MockDepartment.findOneAndUpdate = jest.fn();
MockDepartment.findOneAndDelete = jest.fn();
MockDepartment.deleteOne = jest.fn();
MockDepartment.find = jest.fn();
MockDepartment.create = jest.fn().mockResolvedValue(mockDepartmentData);

export { mockDepartmentData, mockSave };
export default MockDepartment;
