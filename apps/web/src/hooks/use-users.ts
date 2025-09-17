import { useEffect, useState } from "react";
import { isEqual } from "@/utils/utils";
import { getUsers } from "@/services/user.service";
import useUserStore from "@/stores/user.store";
import type { UserType } from "@/types/user.type";

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
          const response = await getUsers();
          const fetchedUsers: UserType[] = response?.result ?? [];
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
        const response = await getUsers();
        const fetchedUsers: UserType[] = response?.result ?? [];
        if (isMounted && !isEqual(usersList, fetchedUsers)) {
          setUsersList(fetchedUsers);
        }
      } catch (err) {
        if (isMounted) setError(err);
      }
    };

    fetchUsers();
    const interval = setInterval(pollUsers, 30000); // refresh every 30s

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
