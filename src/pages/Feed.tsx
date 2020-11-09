import React from "react";
import { PostsList } from "../components/post/postsList";

const Feed: React.FC = () => {
  return (
    <div>
      <PostsList isFeed={true} />
    </div>
  );
};

export default Feed;
