import dayjs from "dayjs";
import React from "react";
import { useHistory } from "react-router-dom";
import { Alert, Avatar, Icon, Nav, Panel, Tag, Tooltip, Whisper } from "rsuite";
import { readNotification } from "../../api/notification.api";
import { Notification, NotificationType } from "../../types/Notification";
import relativeTime from "dayjs/plugin/relativeTime";
import { useDispatch } from "react-redux";
import { setNotificationRead } from "../../redux/notification/notification.actions";

dayjs.extend(relativeTime);

interface NotificationCardProps {
  notification: Notification;
  isInBell?: boolean;
  isInNotification?: boolean;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  isInBell = false,
  isInNotification = false,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const onMarkRead = async () => {
    try {
      await readNotification(notification.id);
      dispatch(setNotificationRead(notification.id));
      Alert.info("Marked as read.", 5000);
    } catch (e) {
      console.log("Error");
      console.log(e);
    }
  };

  return (
    <NotificationDisplay
      notification={notification}
      isInBell={isInBell}
      isInNotification={isInNotification}
      onMarkRead={onMarkRead}
      onPostLinkClick={() => {
        history.push(`/post/${notification.entityId}`);
      }}
      onAuthorLinkClick={() => {
        history.push(`/profile/${notification.sender.id}`);
      }}
    />
  );
};

type NotificationDisplayProps = NotificationCardProps & {
  onMarkRead(): void;
  onPostLinkClick(): void;
  onAuthorLinkClick(): void;
};

export const NotificationDisplay: React.FC<NotificationDisplayProps> = ({
  notification,
  isInBell,
  onMarkRead,
  onPostLinkClick,
  onAuthorLinkClick,
  isInNotification = false,
}) => {
  const fromNow = dayjs(notification.createdAt).fromNow();

  let notificationContent = null;
  if (notification.type === NotificationType.ACCEPTED_FRIEND_REQUEST) {
    notificationContent = <span>has accepted your friend request.</span>;
  } else if (notification.type === NotificationType.SENT_FRIEND_REQUEST) {
    notificationContent = <span>has sent you a friend request.</span>;
  } else if (notification.entityId) {
    if (notification.type === NotificationType.LIKED_YOUR_COMMENT) {
      notificationContent = (
        <span>
          has liked your comment on a{" "}
          <b className="c-pointer" onClick={onPostLinkClick}>
            post
          </b>
          .
        </span>
      );
    } else if (notification.type === NotificationType.LIKED_YOUR_POST) {
      notificationContent = (
        <span>
          has liked your{" "}
          <b className="c-pointer" onClick={onPostLinkClick}>
            post
          </b>
          .
        </span>
      );
    } else if (notification.type === NotificationType.COMMENTED_ON_YOUR_POST) {
      notificationContent = (
        <span>
          has commented your{" "}
          <b className="c-pointer" onClick={onPostLinkClick}>
            post
          </b>
          .
        </span>
      );
    } else if (notification.type === NotificationType.REPLIED_TO_YOUR_COMMENT) {
      notificationContent = (
        <span>
          has replied to your comment on a{" "}
          <b className="c-pointer" onClick={onPostLinkClick}>
            post
          </b>
          .
        </span>
      );
    } else if (
      notification.type === NotificationType.REPLIED_TO_A_COMMENT_YOU_REPLIED_TO
    ) {
      notificationContent = (
        <span>
          has replied to a comment your commented on a{" "}
          <b className="c-pointer" onClick={onPostLinkClick}>
            post
          </b>
          .
        </span>
      );
    }
  }

  if (!notificationContent) {
    return null;
  }

  return (
    <>
      <div className="mb-1">
        <Panel
          header={
            <div className="d-flex justify-content-between align-items-start">
              <div className="d-flex mr-2">
                <Avatar circle>
                  <Icon icon="user" />
                </Avatar>
                <div className="ml-2">
                  <p className="mb-1">
                    <b className="c-pointer" onClick={onAuthorLinkClick}>
                      {notification.sender.name}
                    </b>{" "}
                    {notificationContent}
                  </p>
                  <small>{fromNow}</small>
                  {!notification.read && !isInNotification && (
                    <Tag color="blue" className="ml-2">
                      Unread
                    </Tag>
                  )}
                </div>
              </div>
              {!notification.read && !isInNotification && (
                <div className="d-flex justify-content-center align-items-center">
                  <Nav>
                    <Nav.Item
                      icon={
                        <Whisper
                          placement="bottom"
                          trigger="hover"
                          speaker={<Tooltip>Mark read</Tooltip>}
                        >
                          <Icon icon="eye" />
                        </Whisper>
                      }
                      onClick={() => onMarkRead()}
                    />
                  </Nav>
                </div>
              )}
            </div>
          }
          shaded={isInBell ? undefined : true}
          bodyFill={true}
        />
      </div>
    </>
  );
};
