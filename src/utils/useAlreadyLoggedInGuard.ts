import { useHistory } from "react-router-dom";
import { RootStore } from "../redux/store";
import { useSelector } from "react-redux";

export const useAlreadyLoggedInGuard = () => {
  const history = useHistory();
  const loggedInUser = useSelector(
    (state: RootStore) => state.auth.loggedInUser
  );

  if (loggedInUser) {
    history.push("/");
  }
};
