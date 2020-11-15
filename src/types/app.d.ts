declare namespace NodeJS {
  export interface ProcessEnv {
    REACT_APP_MAPBOX_TOKEN: string;
    REACT_APP_API_URL: string;
    REACT_APP_WS_URL: string;
  }
}

export type AlertTheme =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "light"
  | "dark";
