import { CREATE_SOCIAL_ACCOUNT } from "./createSocialAccount.actionTypes";
import { CreateSocialAccountData } from "../../types/LoginSocialResponse";

export const createSocialAccountAction = (data: CreateSocialAccountData) => {
  return {
    type: CREATE_SOCIAL_ACCOUNT,
    payload: data,
  };
};
