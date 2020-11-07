import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from "./auth.actionTypes";
import { UserExcerpt } from "../../types/UserExcerpt";

export const loginAction = (user: UserExcerpt) => {
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
