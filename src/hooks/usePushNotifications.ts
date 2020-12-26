import { useState, useEffect } from "react";
import { subscribeToPushNotifications } from "../api/push.api";

import {
  isPushNotificationSupported,
  askUserPermission,
  registerServiceWorker,
  createNotificationSubscription,
} from "../utils/push-notifications";
//import all the function created to manage the push notifications

export enum PushNotificationStatus {
  INITIALIZING, // y
  NOT_SUPPORTED, // y
  NOT_INTERACTED,
  PENDING,
  GRANTED,
  DENIED, // y
  CLIENT_ERROR, // y
  PUSH_SERVER_ERROR, // y
  DISABLED_BY_USER, // y
}

const SHOW_ENABLE_NOTIFICATIONS_PROMPT = "SHOW_ENABLE_NOTIFICATIONS_PROMPT";

const pushNotificationSupported = isPushNotificationSupported();

export default function usePushNotifications() {
  const [status, setStatus] = useState(PushNotificationStatus.INITIALIZING);

  useEffect(() => {
    async function registerServiceWorkerF() {
      if (pushNotificationSupported) {
        await registerServiceWorker();
      }

      const showEnableNotificationsPrompt = localStorage.getItem(
        SHOW_ENABLE_NOTIFICATIONS_PROMPT
      );

      if (showEnableNotificationsPrompt === "0") {
        setStatus(PushNotificationStatus.DISABLED_BY_USER);
        return;
      }

      if (Notification.permission === "granted") {
        setStatus(PushNotificationStatus.GRANTED);
      } else if (Notification.permission === "denied") {
        setStatus(PushNotificationStatus.DENIED);
      } else {
        setStatus(PushNotificationStatus.NOT_INTERACTED);
      }
    }

    registerServiceWorkerF();
  }, []);

  const onClickAskUserPermission = async () => {
    setStatus(PushNotificationStatus.PENDING);

    const consent = await askUserPermission();
    if (consent !== "granted") {
      setStatus(PushNotificationStatus.DENIED);
      return;
    }

    let subscription: PushSubscription | null = null;

    try {
      subscription = await createNotificationSubscription();
    } catch (e) {
      console.log("subscription error");
      console.log(e);
    }

    if (!subscription) {
      setStatus(PushNotificationStatus.CLIENT_ERROR);
      return;
    }

    try {
      await subscribeToPushNotifications(subscription);
    } catch (e) {
      setStatus(PushNotificationStatus.PUSH_SERVER_ERROR);
      return;
    }

    setStatus(PushNotificationStatus.GRANTED);
  };

  const onClickNoThanksNotifications = () => {
    localStorage.setItem(SHOW_ENABLE_NOTIFICATIONS_PROMPT, "0");
    setStatus(PushNotificationStatus.DISABLED_BY_USER);
  };

  return {
    status,
    onClickAskUserPermission,
    onClickNoThanksNotifications,
  };
}
