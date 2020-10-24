import { AuthUser } from "./AuthUser";
import { SocialProvider } from "../api/auth.api";

export interface SocialProviderData {
  name: string;
  email: string;
  profilePictureUrl?: string;
}

export interface LoginSocialResponse {
  existingUser: AuthUser | null;
  nonExistingUser: SocialProviderData | null;
}

export interface CreateSocialAccountData {
  providerData: SocialProviderData;
  provider: SocialProvider;
  accessToken: string;
  accessTokenSecret?: string;
}
