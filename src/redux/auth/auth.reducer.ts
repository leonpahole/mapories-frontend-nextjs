import {
  AuthActionTypes,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
} from "./auth.actionTypes";
import { User } from "../../types/User";

interface AuthStateI {
  loggedInUser?: User;
}

const defaultState: AuthStateI = {
  loggedInUser: undefined,
};

const authReducer = (
  state: AuthStateI = defaultState,
  action: AuthActionTypes
): AuthStateI => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        loggedInUser: action.payload,
      };
    case LOGOUT_SUCCESS:
      return {
        loggedInUser: undefined,
      };
    default:
      return state;
  }
};

export default authReducer;
