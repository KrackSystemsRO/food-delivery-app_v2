import { useEffect, useState } from "react";
import { isEqual } from "@/utils/utils";
import useUserStore from "stores/userStore";
import type { Types } from "@my-monorepo/shared";
import { Services } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";

export function useUsers(alwaysFetch = false) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const { usersList, setUsersList } = useUserStore();

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        if (!usersList.length || alwaysFetch) {
          const response = await Services.User.getUsers(axiosInstance, {});
          const fetchedUsers: Types.User.UserType[] = response?.result ?? [];
          if (isMounted && !isEqual(usersList, fetchedUsers)) {
            setUsersList(fetchedUsers);
          }
        }
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const pollUsers = async () => {
      try {
        const response = await Services.User.getUsers(axiosInstance, {});
        const fetchedUsers: Types.User.UserType[] = response?.result ?? [];
        if (isMounted && !isEqual(usersList, fetchedUsers)) {
          setUsersList(fetchedUsers);
        }
      } catch (err) {
        if (isMounted) setError(err);
      }
    };

    fetchUsers();
    const interval = setInterval(pollUsers, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [alwaysFetch, setUsersList, usersList]);

  return {
    loading,
    error,
    data: usersList,
  };
}
