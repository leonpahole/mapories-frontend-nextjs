import {
  AuthActionTypes,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
} from "./auth.actionTypes";
import { AuthenticationData } from "../../api/auth.api";

interface AuthStateI {
  authData?: AuthenticationData;
}

const defaultState: AuthStateI = {
  authData: undefined,
};

const authReducer = (
  state: AuthStateI = defaultState,
  action: AuthActionTypes
): AuthStateI => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        authData: action.payload,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        authData: undefined,
      };
    default:
      return state;
  }
};

export default authReducer;
