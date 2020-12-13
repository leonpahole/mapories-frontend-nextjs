import { useSelector } from "react-redux";
import { RootStore } from "../redux/store";

export const useLoggedInUserData = () => {
  const authData = useSelector((state: RootStore) => state.auth.authData);
  return authData;
};

export const useLoggedInUser = () => {
  const loggedInUser = useSelector(
    (state: RootStore) => state.auth.authData?.user
  );
  return loggedInUser;
};
