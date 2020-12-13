import React from "react";
import { Button } from "shards-react";
import { Post } from "../../types/Post";
import { Loading } from "../Loading";
import { PostCard } from "./PostCard";

export interface PostsListProps {
  posts: Post[];
  loading: boolean;
  moreAvailable: boolean;
  fetchMore: () => void;
  onLikeOrUnlike: (p: Post, isLike: boolean) => void;
  onUpdate: (post: Post) => void;
  onDelete: (postId: string) => void;
}

export interface PaginationInfo {
  moreAvailable: boolean;
  pageNumber: number;
}

export const defaultPaginationInfo = {
  moreAvailable: false,
  pageNumber: 0,
};

export const PostsList: React.FC<PostsListProps> = ({
  posts,
  loading,
  fetchMore,
  onUpdate,
  onDelete,
  onLikeOrUnlike,
  moreAvailable,
}) => {
  if (posts.length === 0 && loading) {
    return <Loading />;
  }

  let postsList = null;

  if (posts.length === 0) {
    postsList = <div>No posts yet.</div>;
  } else {
    postsList = (
      <div>
        {posts.map((p) => (
          <PostCard
            postInfo={p}
            showSeeDetails={true}
            showMap={false}
            onLikeOrUnlike={(isLike: boolean) => onLikeOrUnlike(p, isLike)}
            onDelete={() => onDelete(p.post.id)}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      {postsList}
      {loading && <Loading />}
      {!loading && moreAvailable && (
        <Button onClick={fetchMore}>Load more</Button>
      )}
    </div>
  );
};
