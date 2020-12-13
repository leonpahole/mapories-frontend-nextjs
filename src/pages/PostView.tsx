import React, { useCallback, useEffect, useState } from "react";
import { FlyToInterpolator } from "react-map-gl";
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

export const PostView: React.FC<{}> = ({}) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loadingPost, setLoadingPost] = useState<boolean>(true);

  let { id } = useParams();
  const history = useHistory();

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

  const [viewport, setViewport] = useState({
    latitude: 45.66,
    longitude: -33.9,
    zoom: 1,
    transitionDuration: 1000,
    transitionInterpolator: new FlyToInterpolator(),
  });

  const changeViewPort = (latitude: number, longitude: number) => {
    setViewport({ ...viewport, zoom: 6, latitude, longitude });
  };

  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

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
      showMap={true}
      showAuthor={true}
      showComments={true}
      onLikeOrUnlike={modifyPostWhenLikeOrUnlike}
      onDelete={onPostDeleted}
      onUpdate={() => {}}
    />
  );
};
