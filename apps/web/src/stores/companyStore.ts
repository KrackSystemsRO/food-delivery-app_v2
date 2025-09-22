import type { Types } from "@my-monorepo/shared";
import { create } from "zustand";

interface CompanyState {
  companiesList: Types.Company.CompanyType[];
  selectedCompany: Types.Company.CompanyType | null;

  setCompaniesList: (companies: Types.Company.CompanyType[]) => void;
  clearCompaniesList: () => void;

  setSelectedCompany: (company: Types.Company.CompanyType | null) => void;
  clearSelectedCompany: () => void;

  updateCompanyInList: (updatedCompany: Types.Company.CompanyType) => void;
}

const useCompanyStore = create<CompanyState>((set) => ({
  companiesList: [],
  selectedCompany: null,

  setCompaniesList: (companies) => set({ companiesList: companies }),
  clearCompaniesList: () => set({ companiesList: [] }),

  setSelectedCompany: (company) => set({ selectedCompany: company }),
  clearSelectedCompany: () => set({ selectedCompany: null }),

  updateCompanyInList: (updatedCompany) =>
    set((state) => ({
      companiesList: state.companiesList.map((company) =>
        company._id === updatedCompany._id ? updatedCompany : company
      ),
    })),
}));

export default useCompanyStore;
