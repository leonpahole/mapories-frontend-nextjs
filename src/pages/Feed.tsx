import React from "react";
import { PostsList } from "../components/post/PostsList";
import { CreateNewPostOrMaporyInput } from "../components/post/CreateNewPostOrMaporyInput";

const Feed: React.FC = () => {
  return (
    <div>
      <div className="mb-3">
        <CreateNewPostOrMaporyInput
          onCreatePost={(p) => console.log()}
          onUpdatePost={(p) => console.log()}
        />
      </div>
      <PostsList isFeed={true} />
    </div>
  );
};

export default Feed;
