import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { getPostById } from "../api/post.api";
import { Loading } from "../components/Loading";
import { PostCard } from "../components/post/PostCard";
import { Post } from "../types/Post";

export const updatePostWithLikeOrUnlike = (p: Post, isLike: boolean): Post => {
  return {
    ...p,
    post: {
      ...p.post,
      likes: {
        myLike: isLike,
        likesAmount: p.post.likes.likesAmount + (isLike ? 1 : -1),
      },
    },
  };
};

export const PostView: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [loadingPost, setLoadingPost] = useState<boolean>(true);

  let { id } = useParams<{ id?: string }>();
  const history = useHistory();

  useEffect(() => {
    async function fetchPost() {
      try {
        const fPost = await getPostById(id!);
        setPost(fPost);
      } catch (e) {
        console.log(e);
      }

      setLoadingPost(false);
    }

    if (id) {
      fetchPost();
    } else {
      setLoadingPost(false);
    }
  }, [id]);

  const modifyPostWhenLikeOrUnlike = (isLike: boolean) => {
    setPost((p) => updatePostWithLikeOrUnlike(p!, isLike));
  };

  const onPostDeleted = () => {
    history.push("/");
  };

  if (loadingPost) {
    return <Loading />;
  }

  if (post == null) {
    return <p>Not found</p>;
  }

  return (
    <PostCard
      postInfo={post}
      onLikeOrUnlike={modifyPostWhenLikeOrUnlike}
      onDelete={onPostDeleted}
      onUpdate={() => {}}
    />
  );
};
