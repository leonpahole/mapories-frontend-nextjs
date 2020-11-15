import React, { useEffect } from "react";
import socketIOClient from "socket.io-client";
import { PostsList } from "../components/post/postsList";
import { useSelector } from "react-redux";
import { RootStore } from "../redux/store";

const ENDPOINT = "http://localhost:4000/chat";

const Feed: React.FC = () => {
  return (
    <div>
      <button></button>
      <PostsList isFeed={true} />
    </div>
  );
};

export default Feed;
