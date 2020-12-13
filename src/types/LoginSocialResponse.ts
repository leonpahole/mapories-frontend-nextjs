import { UserExcerpt } from "./UserExcerpt";
import { SocialProvider, AuthenticationData } from "../api/auth.api";

export interface SocialProviderData {
  name: string;
  email: string;
  profilePictureUrl?: string;
}

export interface LoginSocialResponse {
  existingUserLoginData: AuthenticationData | null;
  nonExistingUser: SocialProviderData | null;
}

export interface CreateSocialAccountData {
  providerData: SocialProviderData;
  provider: SocialProvider;
  accessToken: string;
  accessTokenSecret?: string;
}
