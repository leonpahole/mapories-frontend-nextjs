import React from "react";
import { PostsList } from "../components/post/PostsList";
import { CreateNewPostOrMaporyInput } from "../components/post/CreateNewPostOrMaporyInput";
import { usePostList } from "../hooks/usePostList";

const Feed: React.FC = () => {
  const { addPost, ...postListData } = usePostList();

  return (
    <div>
      <div className="mb-3">
        <CreateNewPostOrMaporyInput onCreatePost={addPost} />
      </div>
      <PostsList {...postListData} />
    </div>
  );
};

export default Feed;
