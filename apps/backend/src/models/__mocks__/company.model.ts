import mongoose from "mongoose";

const mockCompanyData = {
  _id: new mongoose.Types.ObjectId(),
  companyId: 1,
  name: "Acme Inc",
  address: "123 Main St",
  type: "PROVIDER",
  email: "acme@example.com",
  is_active: true,
  phone_number: "1234567890",
  admin: [new mongoose.Types.ObjectId()],
  toObject() {
    return { ...this };
  },
};

const mockSave = jest.fn().mockResolvedValue(mockCompanyData);

function MockCompany(this: any, data: any) {
  Object.assign(this, {
    ...data,
    _id: new mongoose.Types.ObjectId(),
    companyId: data.companyId || 999,
    save: mockSave,
    toObject: () => ({ ...data }),
  });
}

MockCompany.findOne = jest.fn();
MockCompany.findById = jest.fn();
MockCompany.findOneAndUpdate = jest.fn();
MockCompany.findOneAndDelete = jest.fn();
MockCompany.deleteOne = jest.fn();
MockCompany.find = jest.fn();
MockCompany.create = jest.fn().mockResolvedValue(mockCompanyData);

export { mockCompanyData, mockSave };
export default MockCompany;
