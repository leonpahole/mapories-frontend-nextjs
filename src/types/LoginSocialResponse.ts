import { User } from "./User";
import { SocialProvider } from "../api/auth.api";

export interface SocialProviderData {
  name: string;
  email: string;
  profilePicture?: string;
}

export interface LoginSocialResponse {
  existingUser: User | null;
  nonExistingUser: SocialProviderData | null;
}

export interface CreateSocialAccountData {
  providerData: SocialProviderData;
  provider: SocialProvider;
  accessToken: string;
  accessTokenSecret?: string;
}
