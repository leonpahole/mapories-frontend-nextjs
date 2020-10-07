import { useState } from "react";
import { AlertTheme } from "../types/app";

export function useAlert<T extends string>(alertInfo: Record<T, AlertTheme>) {
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertTheme, setAlertTheme] = useState<AlertTheme>("success");
  const [alertType, setAlertType] = useState<T | null>(null);

  const showAlert = (type: T) => {
    setAlertTheme(alertInfo[type]);
    setAlertType(type);
    setAlertOpen(true);
  };

  function closeAlert() {
    setAlertOpen(false);
  }

  return { alertOpen, alertTheme, showAlert, closeAlert, alertType };
}
