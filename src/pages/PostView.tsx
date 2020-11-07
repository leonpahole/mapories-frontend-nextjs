import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardBody, CardTitle } from "shards-react";
import { getPostById } from "../api/post.api";
import { Loading } from "../components/Loading";
import { Post } from "../types/Post";
import { PostCard } from "../components/post/postCard";

export const PostView: React.FC<{}> = ({}) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loadingPost, setLoadingPost] = useState<boolean>(true);

  let { id } = useParams();

  useEffect(() => {
    async function fetchPost() {
      try {
        const fPost = await getPostById(id);
        setPost(fPost);
      } catch (e) {
        console.log(e);
      }

      setLoadingPost(false);
    }

    fetchPost();
  }, [id]);

  const modifyPostWhenLikeOrUnlike = (isLike: boolean) => {
    setPost((p) => ({
      ...p!,
      myLike: isLike,
      likesAmount: p!.likesAmount + (isLike ? 1 : -1),
    }));
  };

  if (loadingPost) {
    return <Loading />;
  }

  if (post == null) {
    return <p>Not found</p>;
  }

  return (
    <PostCard
      post={post}
      showAuthor={true}
      onLikeOrUnlike={modifyPostWhenLikeOrUnlike}
    />
  );
};
