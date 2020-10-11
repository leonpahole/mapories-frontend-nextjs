import { combineReducers } from "redux";
import authReducer from "./auth/auth.reducer";
import createSocialAccountReducer from "./createSocialAccount/createSocialAccount.reducer";

const RootReducer = combineReducers({
  auth: authReducer,
  createSocialAccount: createSocialAccountReducer,
});

export default RootReducer;
