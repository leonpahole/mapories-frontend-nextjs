import { useLoggedInUser } from "../hooks/useLoggedInUser";

export const useIsLoggedIn = () => {
  const loggedInUser = useLoggedInUser();
  return [loggedInUser != null];
};
