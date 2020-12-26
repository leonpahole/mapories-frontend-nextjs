import React from "react";
import { Button, Message } from "rsuite";
import usePushNotifications, {
  PushNotificationStatus,
} from "../hooks/usePushNotifications";

export const NotificationSubscriptionPrompt = () => {
  const {
    status,
    onClickAskUserPermission,
    onClickNoThanksNotifications,
  } = usePushNotifications();

  if (
    status === PushNotificationStatus.DISABLED_BY_USER ||
    status === PushNotificationStatus.NOT_SUPPORTED ||
    status === PushNotificationStatus.INITIALIZING ||
    status === PushNotificationStatus.DENIED ||
    status === PushNotificationStatus.GRANTED
  ) {
    return null;
  }

  if (
    status === PushNotificationStatus.CLIENT_ERROR ||
    status === PushNotificationStatus.PUSH_SERVER_ERROR
  ) {
    return (
      <div className="mb-3">
        <Message
          type="error"
          title="Error"
          description={
            <p>
              There was an error while enabling notifications. Please try
              refreshing this page.
            </p>
          }
        />
      </div>
    );
  }

  return (
    <div className="mb-3">
      <Message
        type="info"
        title="Enable notifications?"
        description={
          <div>
            <p className="mb-3">
              {status === PushNotificationStatus.PENDING
                ? 'Press "allow" in the prompt window.'
                : "We would like to send you notifications so that you never miss what's going on on your Mapories."}
            </p>
            <div className="d-flex">
              <Button
                type="submit"
                className="mr-2"
                appearance="primary"
                onClick={onClickAskUserPermission}
              >
                Ask for permission
              </Button>
              <Button
                type="submit"
                className="ml-2"
                appearance="subtle"
                onClick={onClickNoThanksNotifications}
              >
                No, thanks
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
};
