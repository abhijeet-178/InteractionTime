import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "../lib/lib";

const useLogin = () => {
  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // ✅ immediately update auth cache
      queryClient.setQueryData(["authUser"], data.user);

      // optional refetch for safety
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return { loginMutation, isPending, error };
};

export default useLogin;
