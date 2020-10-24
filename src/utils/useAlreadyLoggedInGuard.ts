import { RootStore } from "../redux/store";
import { useSelector } from "react-redux";

export const useIsLoggedIn = () => {
  const loggedInUser = useSelector(
    (state: RootStore) => state.auth.loggedInUser
  );

  return [loggedInUser != null];
};
