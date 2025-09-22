import type { Types } from "@my-monorepo/shared";
import { create } from "zustand";

interface UserState {
  usersList: Types.User.UserType[];
  selectedUser: Types.User.UserType | null;

  setUsersList: (users: Types.User.UserType[]) => void;
  clearUsersList: () => void;

  setSelectedUser: (user: Types.User.UserType | null) => void;
  clearSelectedUser: () => void;

  updateUserInList: (updatedUser: Types.User.UserType) => void;
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
