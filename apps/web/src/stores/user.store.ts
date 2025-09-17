import { create } from "zustand";
import type { UserType } from "@/types/user.type";

interface UserState {
  usersList: UserType[];
  selectedUser: UserType | null;

  setUsersList: (users: UserType[]) => void;
  clearUsersList: () => void;

  setSelectedUser: (user: UserType | null) => void;
  clearSelectedUser: () => void;

  updateUserInList: (updatedUser: UserType) => void;
}

const useUserStore = create<UserState>((set) => ({
  usersList: [],
  selectedUser: null,

  setUsersList: (users) => set({ usersList: users }),
  clearUsersList: () => set({ usersList: [] }),

  setSelectedUser: (user) => set({ selectedUser: user }),
  clearSelectedUser: () => set({ selectedUser: null }),

  updateUserInList: (updatedUser) =>
    set((state) => ({
      usersList: state.usersList.map((user) =>
        user._id === updatedUser._id ? updatedUser : user
      ),
    })),
}));

export default useUserStore;
