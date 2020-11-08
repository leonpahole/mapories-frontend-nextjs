import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardBody, CardTitle } from "shards-react";
import { unlikeComment, likeComment } from "../../api/post.api";
import { Comment } from "../../types/Comment";

interface CommentCardProps {
  postId: string;
  onLikeOrUnlike(isLike: boolean): void;
  comment: Comment;
}

export const CommentCard: React.FC<CommentCardProps> = ({
  postId,
  onLikeOrUnlike,
  comment,
}) => {
  const likeOrUnlike = async () => {
    try {
      if (comment.likes.myLike) {
        await unlikeComment(postId, comment.id);
      } else {
        await likeComment(postId, comment.id);
      }

      onLikeOrUnlike(!comment.likes.myLike);
    } catch (e) {
      alert("Error!");
    }
  };

  return (
    <>
      <div>
        <div>
          <p>Posted by {comment.author.name}</p>
          <Link to={`/profile/${comment.author.id}`}>
            <small className="text-secondary c-pointer block mt-3 mb-3">
              See profile
            </small>
          </Link>
        </div>
        <Card className="mb-3">
          <CardBody>
            <CardTitle>{comment.content}</CardTitle>
            <p>Likes: {comment.likes.likesAmount}</p>
            <div className="d-flex">
              <Button onClick={likeOrUnlike}>
                {comment.likes.myLike ? "Unlike" : "Like"}
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};
