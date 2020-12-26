import axios from "axios";
import jwtDecode from "jwt-decode";
import store from "../redux/store";
import { refreshToken } from "./auth.api";

const apiUrl = process.env.REACT_APP_API_URL;

export const convertPictureUri = (uri: string) => {
  return `${apiUrl}/${uri}`;
};

export const api = axios.create({
  withCredentials: true,
  baseURL: apiUrl,
});

// Request interceptor for API calls
api.interceptors.request.use(
  async (config) => {
    let token = store.getState().auth.authData?.accessToken;
    let tokenNeedsRefreshing = true;
    if (token) {
      const { exp } = jwtDecode(token) as any;
      console.log(exp);
      if (Date.now() < exp * 1000) {
        tokenNeedsRefreshing = false;
      }
    }

    if (tokenNeedsRefreshing) {
      try {
        const { accessToken } = await refreshToken();
        token = accessToken;
      } catch (e) {}
    }

    config.headers = {
      Authorization: token ? `Bearer ${token}` : "",
      Accept: "application/json",
    };

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
