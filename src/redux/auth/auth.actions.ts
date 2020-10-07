import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from "./auth.actionTypes";
import { User } from "../../types/User";

export const loginAction = (user: User) => {
  return {
    type: LOGIN_SUCCESS,
    payload: user,
  };
};

export const logoutAction = () => {
  return {
    type: LOGOUT_SUCCESS,
  };
};
