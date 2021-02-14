import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loading } from "../components/Loading";
import { NotificationCard } from "../components/notification/NotificationCard";
import { NotificationSubscriptionPrompt } from "../components/NotificationSubscriptionPrompt";
import { fetchNotifications } from "../redux/notification/notification.actions";
import { RootStore } from "../redux/store";

export const NotificationCenter: React.FC = () => {
  const loading = useSelector((r: RootStore) => r.notifications.loading);
  const notifications = useSelector(
    (r: RootStore) => r.notifications.notifications
  );
  const cursor = useSelector((r: RootStore) => r.notifications.cursor);

  const dispatch = useDispatch();

  const fetchNotificationsF = async () => {
    dispatch(fetchNotifications(cursor));
  };

  useEffect(() => {
    document.addEventListener("scroll", trackScrolling);

    return () => {
      document.removeEventListener("scroll", trackScrolling);
    };
  }, [loading, cursor]);

  const trackScrolling = () => {
    if (loading || cursor === null) {
      return;
    }

    const wrappedElement = document.getElementById("notification-list-wrapper");
    if (isBottom(wrappedElement)) {
      fetchNotificationsF();
    }
  };

  const isBottom = (el: any) => {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  };

  if (notifications.length === 0 && loading) {
    return <Loading />;
  }

  let notificationList = null;
  if (notifications.length === 0) {
    notificationList = (
      <div className="d-flex justify-content-center">No notifications yet.</div>
    );
  } else {
    notificationList = (
      <div id="notification-list-wrapper">
        <h3 className="mb-2">Notification center</h3>
        {notifications.map((n) => (
          <NotificationCard key={n.id} notification={n} />
        ))}
      </div>
    );
  }

  return (
    <div id="post-list-wrapper">
      <NotificationSubscriptionPrompt />
      {notificationList}
      {loading && <Loading />}
    </div>
  );
};
