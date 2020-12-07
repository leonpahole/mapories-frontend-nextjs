import { useState, useReducer } from "react";
import { MyAlertState } from "../components/MyAlert";

export const UNKNOWN_ERROR = "UNKNOWN_ERROR";
export const UnknownErrorMyAlertState: MyAlertState = {
  type: "error",
  title: "Unknown error has occured.",
  description: "Please try again later.",
};

type ReducerType<T> = (state: MyAlertState, action: T) => MyAlertState;

export function useAlert<T>(reducer: ReducerType<T>) {
  const [alertState, dispatchAlert] = useReducer<ReducerType<T>>(
    reducer,
    UnknownErrorMyAlertState
  );

  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  function openAlert(action: T) {
    dispatchAlert(action);
    setAlertOpen(true);
  }

  function onAlertClose() {
    setAlertOpen(false);
  }

  return {
    alertOpen,
    alertState,
    openAlert,
    onAlertClose,
  };
}
