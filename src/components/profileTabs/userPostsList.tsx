import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPostsForUser } from "../../api/post.api";
import { Post } from "../../types/Post";
import { Loading } from "../Loading";
import { PostCard } from "../post/postCard";
import { updatePostWithLikeOrUnlike } from "../../pages/PostView";
import { Button } from "shards-react";

interface UserPostsListProps {
  userId: string;
}

export interface PaginationInfo {
  moreAvailable: boolean;
  pageNumber: number;
}

export const defaultPaginationInfo = {
  moreAvailable: false,
  pageNumber: 0,
};

export const UserPostsList: React.FC<UserPostsListProps> = ({ userId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>(
    defaultPaginationInfo
  );

  const fetchPosts = async () => {
    try {
      setLoadingPosts(true);
      const fPosts = await getPostsForUser(userId, paginationInfo.pageNumber);
      setPosts([...posts, ...fPosts.data]);
      setPaginationInfo({
        moreAvailable: fPosts.moreAvailable,
        pageNumber: paginationInfo.pageNumber + 1,
      });
    } catch (e) {
      console.log(e);
      alert("Error");
    }

    setLoadingPosts(false);
  };

  useEffect(() => {
    setPaginationInfo(defaultPaginationInfo);
    fetchPosts();
  }, [userId]);

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
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      <Link to="/create-post">
        <small className="text-secondary c-pointer block mt-3 mb-3">
          Create a post
        </small>
      </Link>
      <Link to="/create-mapory">
        <small className="text-secondary c-pointer block mt-3 mb-3">
          Create a mapory
        </small>
      </Link>
      {postsList}
      {loadingPosts && <Loading />}
      {!loadingPosts && paginationInfo.moreAvailable && (
        <Button onClick={fetchPosts}>Load more</Button>
      )}
    </div>
  );
};
