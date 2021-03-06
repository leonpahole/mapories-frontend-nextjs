import { AuthenticationData } from "../../api/auth.api";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";

export interface LoginSuccess {
  type: typeof LOGIN_SUCCESS;
  payload: AuthenticationData;
}

export interface LogoutSuccess {
  type: typeof LOGOUT_SUCCESS;
}

export type AuthActionTypes = LoginSuccess | LogoutSuccess;
