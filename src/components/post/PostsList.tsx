import React, { useEffect } from "react";
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
  useEffect(() => {
    document.addEventListener("scroll", trackScrolling);

    return () => {
      document.removeEventListener("scroll", trackScrolling);
    };
  }, [loading, moreAvailable]);

  const trackScrolling = () => {
    if (loading || !moreAvailable) {
      return;
    }

    const wrappedElement = document.getElementById("post-list-wrapper");
    if (isBottom(wrappedElement)) {
      fetchMore();
    }
  };

  const isBottom = (el: any) => {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  };

  if (posts.length === 0 && loading) {
    return <Loading />;
  }

  let postsList = null;

  if (posts.length === 0) {
    postsList = (
      <div className="d-flex justify-content-center">No posts yet.</div>
    );
  } else {
    postsList = (
      <div>
        {posts.map((p) => (
          <PostCard
            key={p.post.id}
            postInfo={p}
            onLikeOrUnlike={(isLike: boolean) => onLikeOrUnlike(p, isLike)}
            onDelete={() => onDelete(p.post.id)}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    );
  }

  return (
    <div id="post-list-wrapper">
      {postsList}
      {loading && <Loading />}
    </div>
  );
};
