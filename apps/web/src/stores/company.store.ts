import { create } from "zustand";
import type { CompanyType } from "@/types/company.type";

interface CompanyState {
  companiesList: CompanyType[];
  selectedCompany: CompanyType | null;

  setCompaniesList: (companies: CompanyType[]) => void;
  clearCompaniesList: () => void;

  setSelectedCompany: (company: CompanyType | null) => void;
  clearSelectedCompany: () => void;

  updateCompanyInList: (updatedCompany: CompanyType) => void;
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
