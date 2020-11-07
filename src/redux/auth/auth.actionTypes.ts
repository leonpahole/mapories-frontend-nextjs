import { UserExcerpt } from "../../types/UserExcerpt";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";

export interface LoginSuccess {
  type: typeof LOGIN_SUCCESS;
  payload: UserExcerpt;
}

export interface LogoutSuccess {
  type: typeof LOGOUT_SUCCESS;
}

export type AuthActionTypes = LoginSuccess | LogoutSuccess;
