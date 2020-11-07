import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle, Button } from "shards-react";
import { Post } from "../../types/Post";
import { unlikePost, likePost } from "../../api/post.api";

interface PostCardProps {
  post: Post;
  showAuthor?: boolean;
  showSeeDetails?: boolean;
  onLikeOrUnlike(isLike: boolean): void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  showAuthor = false,
  showSeeDetails = false,
  onLikeOrUnlike,
}) => {
  const likeOrUnlike = async () => {
    try {
      if (post.myLike) {
        await unlikePost(post.id);
      } else {
        await likePost(post.id);
      }

      onLikeOrUnlike(!post.myLike);

      alert("Success!");
    } catch (e) {
      alert("Error!");
    }
  };

  return (
    <div>
      {showAuthor && (
        <div>
          <p>Posted by {post.author.name}</p>

          <Link to={`/profile/${post.author.id}`}>
            <small className="text-secondary c-pointer block mt-3 mb-3">
              See profile
            </small>
          </Link>
        </div>
      )}
      <Card className="mb-3">
        <CardBody>
          <CardTitle>{post.content}</CardTitle>
          {showSeeDetails && (
            <Link to={`/post/${post.id}`}>
              <small className="text-secondary c-pointer block mt-3 mb-3">
                See details
              </small>
            </Link>
          )}
          <p>Likes: {post.likesAmount}</p>
          <div className="d-flex">
            <Button onClick={likeOrUnlike}>
              {post.myLike ? "Unlike" : "Like"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
