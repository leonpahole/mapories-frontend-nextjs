import { User } from "../../types/User";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";

export interface LoginSuccess {
  type: typeof LOGIN_SUCCESS;
  payload: User;
}

export interface LogoutSuccess {
  type: typeof LOGOUT_SUCCESS;
}

export type AuthActionTypes = LoginSuccess | LogoutSuccess;
