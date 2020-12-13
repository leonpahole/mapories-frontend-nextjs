import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from "./auth.actionTypes";
import { UserExcerpt } from "../../types/UserExcerpt";
import { AuthenticationData } from "../../api/auth.api";

export const loginAction = (data: AuthenticationData) => {
  return {
    type: LOGIN_SUCCESS,
    payload: data,
  };
};

export const logoutAction = () => {
  return {
    type: LOGOUT_SUCCESS,
  };
};
