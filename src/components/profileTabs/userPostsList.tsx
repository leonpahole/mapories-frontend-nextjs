import React from "react";
import { Link } from "react-router-dom";
import { Loading } from "../Loading";
import { PostsList } from "../post/postsList";

interface UserPostsListProps {
  userId: string;
}

export const UserPostsList: React.FC<UserPostsListProps> = ({ userId }) => {
  if (!userId) {
    return <Loading />;
  }

  return (
    <div>
      <Link to="/create-or-update-post">
        <small className="text-secondary c-pointer block mt-3 mb-3">
          Create a post
        </small>
      </Link>
      <Link to="/create-or-update-mapory">
        <small className="text-secondary c-pointer block mt-3 mb-3">
          Create a mapory
        </small>
      </Link>
      <PostsList userId={userId} />
    </div>
  );
};
