import { User } from "../types/User";
import { api } from "./api";
import { LoginSocialResponse } from "../types/LoginSocialResponse";

export type SocialProvider = "facebook" | "google" | "twitter";

export const register = async (
  email: string,
  name: string,
  password: string
): Promise<User> => {
  const res = await api.post<User>(`auth/register`, {
    email,
    name,
    password,
  });

  return res.data;
};

export const verifyEmail = async (token: string): Promise<User> => {
  const res = await api.post<User>(`auth/verify-account`, {
    token,
  });
  return res.data;
};

export const login = async (email: string, password: string): Promise<User> => {
  const res = await api.post<User>(`auth/login`, {
    email,
    password,
  });

  return res.data;
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
  accessTokenSecret?: string
): Promise<User> => {
  const res = await api.post<User>(`auth/register-social/${provider}`, {
    name,
    accessToken,
    accessTokenSecret,
  });

  return res.data;
};
