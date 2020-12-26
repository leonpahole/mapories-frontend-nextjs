import React from "react";
import { useLoggedInUser } from "../../hooks/useLoggedInUser";
import { usePostList } from "../../hooks/usePostList";
import { CreateNewPostOrMaporyInput } from "../post/CreateNewPostOrMaporyInput";
import { PostsList } from "../post/PostsList";

interface UserPostsListProps {
  userId: string;
}

export const UserPostsList: React.FC<UserPostsListProps> = ({ userId }) => {
  const { addPost, ...postListData } = usePostList(userId);

  const loggedInUser = useLoggedInUser();
  const isMe = loggedInUser!.id === userId;

  return (
    <div>
      {isMe && (
        <div className="mb-3">
          <CreateNewPostOrMaporyInput onCreatePost={addPost} />
        </div>
      )}
      <PostsList {...postListData} />
    </div>
  );
};
