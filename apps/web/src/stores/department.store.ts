import type { Types } from "@my-monorepo/shared";
import { create } from "zustand";

interface DepartmentState {
  departmentsList: Types.Department.DepartmentType[];
  selectedDepartment: Types.Department.DepartmentType | null;

  setDepartmentsList: (departments: Types.Department.DepartmentType[]) => void;
  clearDepartmentsList: () => void;

  setSelectedDepartment: (
    department: Types.Department.DepartmentType | null
  ) => void;
  clearSelectedDepartment: () => void;

  updateDepartmentInList: (
    updatedDepartment: Types.Department.DepartmentType
  ) => void;
}

const useDepartmentStore = create<DepartmentState>((set) => ({
  departmentsList: [],
  selectedDepartment: null,

  setDepartmentsList: (departments) => set({ departmentsList: departments }),
  clearDepartmentsList: () => set({ departmentsList: [] }),

  setSelectedDepartment: (department) =>
    set({ selectedDepartment: department }),
  clearSelectedDepartment: () => set({ selectedDepartment: null }),

  updateDepartmentInList: (updatedDepartment) =>
    set((state) => ({
      departmentsList: state.departmentsList.map((department) =>
        department._id === updatedDepartment._id
          ? updatedDepartment
          : department
      ),
    })),
}));

export default useDepartmentStore;
