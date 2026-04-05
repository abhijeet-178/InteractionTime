import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/lib.js";

const useAuthUser = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
    select: (res) => res.user || null, // ✅ ensures we always return `user` object or null
  });

  return {
    authUser: data,
    isLoading,
    error,
    refetch,
  };
};

export default useAuthUser;
