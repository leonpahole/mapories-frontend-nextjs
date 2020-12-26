import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Badge, Icon, Nav, Notification, Popover, Whisper } from "rsuite";
import { useUnreadNotificationCount } from "../../hooks/useLoggedInUser";
import { setNotificationRead } from "../../redux/notification/notification.actions";
import { RootStore } from "../../redux/store";
import { Loading } from "../Loading";
import { NotificationCard, NotificationDisplay } from "./NotificationCard";

const NotificationPopover = ({
  notifications,
  loading,
  onRead,
  ...props
}: any) => {
  const history = useHistory();

  let notificationList = <h6 className="mb-3 mt-3">No notifications yet.</h6>;
  if (notifications.length > 0) {
    notificationList = notifications.map((n: any) => (
      <NotificationCard key={n.id} isInBell={true} notification={n} />
    ));
  }

  return (
    <Popover title="Notifications" {...props}>
      {!loading && notificationList}
      {loading && <Loading />}
      <div
        className="d-flex justify-content-center mb-2 c-pointer"
        onClick={() => {
          history.push("/notification-center");
        }}
      >
        <b>Go to notification center</b>
      </div>
    </Popover>
  );
};

export const NotificationBell = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const unreadCount = useUnreadNotificationCount();
  const loading = useSelector((r: RootStore) => r.notifications.loading);
  const notifications = useSelector((r: RootStore) =>
    r.notifications.notifications.slice(0, 5)
  );

  const newNotification = useSelector(
    (r: RootStore) => r.notifications.mostRecentNotification
  );

  useEffect(() => {
    if (!newNotification) {
      return;
    }

    Notification.open({
      duration: 20000,
      description: (
        <NotificationDisplay
          notification={newNotification}
          onMarkRead={() => {
            dispatch(setNotificationRead(newNotification.id));
          }}
          isInBell={true}
          isInNotification={true}
          onPostLinkClick={() => {
            history.push(`/post/${newNotification.entityId}`);
          }}
          onAuthorLinkClick={() => {
            history.push(`/profile/${newNotification.sender.id}`);
          }}
        />
      ),
    });
  }, [newNotification]);

  return (
    <Whisper
      trigger="click"
      placement={"bottomEnd"}
      speaker={
        <NotificationPopover loading={loading} notifications={notifications} />
      }
    >
      <Nav.Item
        icon={
          <Badge content={unreadCount > 0 ? unreadCount : false} maxCount={9}>
            <Icon icon="bell-o" />
          </Badge>
        }
      ></Nav.Item>
    </Whisper>
  );
};
