import { create } from "zustand";
import type { DepartmentType } from "@/types/department.type";

interface DepartmentState {
  departmentsList: DepartmentType[];
  selectedDepartment: DepartmentType | null;

  setDepartmentsList: (departments: DepartmentType[]) => void;
  clearDepartmentsList: () => void;

  setSelectedDepartment: (department: DepartmentType | null) => void;
  clearSelectedDepartment: () => void;

  updateDepartmentInList: (updatedDepartment: DepartmentType) => void;
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
