// if userId defined - posts of user

import { useEffect, useState } from "react";
import { getMyFeed, getPostsForUser } from "../api/post.api";
import {
  defaultPaginationInfo,
  PaginationInfo,
  PostsListProps,
} from "../components/post/PostsList";
import { updatePostWithLikeOrUnlike } from "../pages/PostView";
import { Post } from "../types/Post";

// if userId undefined - feed
export const usePostList = (
  userId?: string
): PostsListProps & {
  addPost: (p: Post) => void;
} => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>(
    defaultPaginationInfo
  );

  const fetchPosts = async (paginationInfoOverride?: PaginationInfo) => {
    try {
      setLoadingPosts(true);

      let usedPaginationInfo = paginationInfoOverride || paginationInfo;
      let fPosts = null;
      if (userId) {
        fPosts = await getPostsForUser(userId, usedPaginationInfo.pageNumber);
      } else {
        fPosts = await getMyFeed(usedPaginationInfo.pageNumber);
      }

      setPosts([...posts, ...fPosts.data]);
      setPaginationInfo({
        moreAvailable: fPosts.moreAvailable,
        pageNumber: usedPaginationInfo.pageNumber + 1,
      });
    } catch (e) {
      console.log(e);
    }

    setLoadingPosts(false);
  };

  useEffect(() => {
    setPaginationInfo(defaultPaginationInfo);
    fetchPosts(defaultPaginationInfo);
  }, [userId]);

  const updatePostsOnLikeOrUnlike = async (post: Post, isLike: boolean) => {
    setPosts((pList) => {
      return pList.map((p) => {
        if (p.post.id !== post.post.id) {
          return p;
        }

        return updatePostWithLikeOrUnlike(p, isLike);
      });
    });
  };

  const updatePostsOnPostDelete = async (postId: string) => {
    setPosts((pList) => {
      return pList.filter((p) => p.post.id !== postId);
    });
  };

  const addPost = async (post: Post) => {
    setPosts([post, ...posts]);
  };

  const updatePost = async (post: Post) => {
    const newPosts = posts.map((p) => {
      if (p.post.id === post.post.id) {
        return { ...post };
      }

      return p;
    });
    setPosts(newPosts);
  };

  return {
    posts,
    loading: loadingPosts,
    moreAvailable: paginationInfo.moreAvailable,
    onLikeOrUnlike: updatePostsOnLikeOrUnlike,
    onDelete: updatePostsOnPostDelete,
    fetchMore: fetchPosts,
    addPost,
    onUpdate: updatePost,
  };
};
