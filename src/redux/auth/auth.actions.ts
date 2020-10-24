import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from "./auth.actionTypes";
import { AuthUser } from "../../types/AuthUser";

export const loginAction = (user: AuthUser) => {
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
