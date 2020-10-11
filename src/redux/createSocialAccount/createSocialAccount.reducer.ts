import {
  CreateSocialAccountActionTypes,
  CREATE_SOCIAL_ACCOUNT,
} from "./createSocialAccount.actionTypes";
import { CreateSocialAccountData } from "../../types/LoginSocialResponse";

interface CreateSocialAccountStateI {
  data?: CreateSocialAccountData;
}

const defaultState: CreateSocialAccountStateI = {
  data: undefined,
};

const createSocialAccountReducer = (
  state: CreateSocialAccountStateI = defaultState,
  action: CreateSocialAccountActionTypes
): CreateSocialAccountStateI => {
  switch (action.type) {
    case CREATE_SOCIAL_ACCOUNT:
      return {
        data: action.payload,
      };
    default:
      return state;
  }
};

export default createSocialAccountReducer;
