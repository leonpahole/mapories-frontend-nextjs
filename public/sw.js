function receivePushNotification(event) {
  console.log("[Service Worker] Push Received.");

  const notification = JSON.parse(event.data.text());

  if (!notification || !notification.sender) {
    return;
  }

  let text = notification.sender.name + " ";
  let link = "http://localhost:3000";

  if (notification.type === "ACCEPTED_FRIEND_REQUEST") {
    text += "has accepted your friend request.";
    link += `/profile/${notification.sender.id}`;
  } else if (notification.type === "SENT_FRIEND_REQUEST") {
    text += "has sent you a friend request.";
    link += `/profile/${notification.sender.id}`;
  } else if (notification.entityId) {
    link += `/post/${notification.entityId}`;
    if (notification.type === "LIKED_YOUR_COMMENT") {
      text += "has liked your comment on a post";
    } else if (notification.type === "LIKED_YOUR_POST") {
      text += "has liked your post";
    } else if (notification.type === "COMMENTED_ON_YOUR_POST") {
      text += "has commented your post";
    } else if (notification.type === "REPLIED_TO_YOUR_COMMENT") {
      text += "has replied to your comment on a post";
    } else if (notification.type === "REPLIED_TO_A_COMMENT_YOU_REPLIED_TO") {
      text += "has replied to a comment you commented on a post";
    }
  }

  const options = {
    data: link,
    body: text,
    vibrate: [200, 100, 200],
    tag: notification.id,
    actions: [
      {
        action: "Detail",
        title: "View",
      },
    ],
  };
  event.waitUntil(self.registration.showNotification(text, options));
}

function openPushNotification(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data));
}

self.addEventListener("push", receivePushNotification);
self.addEventListener("notificationclick", openPushNotification);
