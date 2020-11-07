import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardBody, CardTitle } from "shards-react";
import { likeMapory, unlikeMapory } from "../../api/mapory.api";
import { getPostsForUser } from "../../api/post.api";
import { Post } from "../../types/Post";
import { Loading } from "../Loading";
import { PostCard } from "../post/postCard";

interface UserPostsListProps {
  userId: string;
}

export const UserPostsList: React.FC<UserPostsListProps> = ({ userId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const fPosts = await getPostsForUser(userId);
        setPosts(fPosts);
      } catch (e) {
        console.log(e);
      }

      setLoadingPosts(false);
    }

    fetchPosts();
  }, [userId]);

  if (loadingPosts) {
    return <Loading />;
  }

  let postsList = null;

  const updatePostsOnLikeOrUnlike = async (post: Post, isLike: boolean) => {
    setPosts((pList) => {
      return pList.map((p) => {
        if (p.id !== post.id) {
          return p;
        }

        return {
          ...p,
          likesAmount: p.likesAmount + (isLike ? 1 : -1),
          myLike: isLike,
        };
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
            post={p}
            showSeeDetails={true}
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
      {postsList}
    </div>
  );
};
