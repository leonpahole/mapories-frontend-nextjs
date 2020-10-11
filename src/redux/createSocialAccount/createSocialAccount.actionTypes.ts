import { CreateSocialAccountData } from "../../types/LoginSocialResponse";

export const CREATE_SOCIAL_ACCOUNT = "CREATE_SOCIAL_ACCOUNT";

export interface CreateSocialAccount {
  type: typeof CREATE_SOCIAL_ACCOUNT;
  payload: CreateSocialAccountData;
}

export type CreateSocialAccountActionTypes = CreateSocialAccount;
