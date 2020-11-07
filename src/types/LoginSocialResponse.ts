import { UserExcerpt } from "./UserExcerpt";
import { SocialProvider } from "../api/auth.api";

export interface SocialProviderData {
  name: string;
  email: string;
  profilePictureUrl?: string;
}

export interface LoginSocialResponse {
  existingUser: UserExcerpt | null;
  nonExistingUser: SocialProviderData | null;
}

export interface CreateSocialAccountData {
  providerData: SocialProviderData;
  provider: SocialProvider;
  accessToken: string;
  accessTokenSecret?: string;
}
