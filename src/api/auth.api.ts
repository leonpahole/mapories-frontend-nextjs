import { UserExcerpt } from "../types/UserExcerpt";
import { api } from "./api";
import { LoginSocialResponse } from "../types/LoginSocialResponse";

export type SocialProvider = "facebook" | "google" | "twitter";

export interface AuthenticationData {
  accessToken: string;
  user: UserExcerpt;
}

export const register = async (
  email: string,
  name: string,
  password: string
): Promise<UserExcerpt> => {
  const res = await api.post<UserExcerpt>(`auth/register`, {
    email,
    name,
    password,
  });

  return res.data;
};

export const verifyEmail = async (token: string): Promise<UserExcerpt> => {
  const res = await api.post<UserExcerpt>(`auth/verify-account`, {
    token,
  });
  return res.data;
};

export const login = async (
  email: string,
  password: string,
  rememberMe: boolean = false
): Promise<AuthenticationData> => {
  const res = await api.post<AuthenticationData>(`auth/login`, {
    email,
    password,
    rememberMe,
  });

  return res.data;
};

export const refreshToken = async (): Promise<AuthenticationData> => {
  const res = await fetch(
    `${process.env.REACT_APP_API_URL}/auth/refresh-token`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  const data = await res.json();
  if (res.status >= 400) {
    throw data;
  }

  return data;
};

export const logout = async (): Promise<boolean> => {
  const res = await api.post<boolean>(`auth/logout`);
  return res.data;
};

export const resendVerifyAccountEmail = async (
  email: string
): Promise<void> => {
  await api.post<void>(`auth/resend-verify-account-email`, {
    email,
  });
};

export const sendForgotPasswordEmail = async (email: string): Promise<void> => {
  await api.post<void>(`auth/forgot-password`, {
    email,
  });
};

export const validateForgotPasswordToken = async (
  token: string
): Promise<{ valid: boolean }> => {
  const res = await api.post<{ valid: boolean }>(
    `auth/validate-forgot-password-token`,
    {
      token,
    }
  );

  return res.data;
};

export const resetForgotPassword = async (
  token: string,
  newPassword: string
): Promise<void> => {
  await api.post<void>(`auth/reset-forgot-password`, {
    token,
    newPassword,
  });
};

export const loginSocial = async (
  accessToken: string,
  provider: SocialProvider,
  accessTokenSecret?: string
): Promise<LoginSocialResponse> => {
  const res = await api.post<LoginSocialResponse>(
    `auth/login-social/${provider}`,
    {
      accessToken,
      accessTokenSecret,
    }
  );

  return res.data;
};

export const registerSocial = async (
  name: string,
  provider: SocialProvider,
  accessToken: string,
  profilePictureUrl?: string,
  accessTokenSecret?: string
): Promise<AuthenticationData> => {
  const res = await api.post<AuthenticationData>(
    `auth/register-social/${provider}`,
    {
      name,
      accessToken,
      accessTokenSecret,
      profilePictureUrl,
    }
  );

  return res.data;
};

export const changePassword = async (newPassword: string) => {
  await api.post<void>(`auth/change-password`, {
    newPassword,
  });
};
