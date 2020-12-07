import React, { useEffect, useState } from "react";
import { Button } from "shards-react";
import { getMyFeed, getPostsForUser } from "../../api/post.api";
import { updatePostWithLikeOrUnlike } from "../../pages/PostView";
import { Post } from "../../types/Post";
import { Loading } from "../Loading";
import { PostCard } from "./PostCard";

interface PostsListProps {
  userId?: string;
  isFeed?: boolean;
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
  userId = null,
  isFeed = false,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>(
    defaultPaginationInfo
  );

  const fetchPosts = async () => {
    try {
      setLoadingPosts(true);

      let fPosts = null;
      if (userId) {
        fPosts = await getPostsForUser(userId, paginationInfo.pageNumber);
      } else if (isFeed) {
        fPosts = await getMyFeed(paginationInfo.pageNumber);
      }

      if (!fPosts) {
        console.warn("No configuration for postList, empty posts returned");
        setPosts([]);
        setPaginationInfo({
          moreAvailable: false,
          pageNumber: paginationInfo.pageNumber + 1,
        });
      } else {
        setPosts([...posts, ...fPosts.data]);
        setPaginationInfo({
          moreAvailable: fPosts.moreAvailable,
          pageNumber: paginationInfo.pageNumber + 1,
        });
      }
    } catch (e) {
      console.log(e);
      alert("Error");
    }

    setLoadingPosts(false);
  };

  useEffect(() => {
    setPaginationInfo(defaultPaginationInfo);
    fetchPosts();
  }, []);

  if (posts.length === 0 && loadingPosts) {
    return <Loading />;
  }

  let postsList = null;

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
            onLikeOrUnlike={(isLike: boolean) =>
              updatePostsOnLikeOrUnlike(p, isLike)
            }
            onDelete={() => updatePostsOnPostDelete(p.post.id)}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      {postsList}
      {loadingPosts && <Loading />}
      {!loadingPosts && paginationInfo.moreAvailable && (
        <Button onClick={fetchPosts}>Load more</Button>
      )}
    </div>
  );
};
