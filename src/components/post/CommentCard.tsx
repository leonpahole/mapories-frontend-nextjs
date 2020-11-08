import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardBody, CardTitle } from "shards-react";
import {
  unlikeComment,
  likeComment,
  deleteComment,
  updateComment,
  createComment,
} from "../../api/post.api";
import { Comment } from "../../types/Comment";
import { useSelector } from "react-redux";
import { RootStore } from "../../redux/store";
import { Formik } from "formik";
import { AuthForm } from "../../pages/login";
import { MyTextInput } from "../formik/MyTextInput";
import * as Yup from "yup";

interface CommentCardProps {
  postId: string;
  onLikeOrUnlike(isLike: boolean): void;
  onEdited(content: string): void;
  onDeleted(): void;
  comment: Comment;
}

export const CommentCard: React.FC<CommentCardProps> = ({
  postId,
  onLikeOrUnlike,
  comment,
  onEdited,
  onDeleted,
}) => {
  const loggedInUser = useSelector(
    (state: RootStore) => state.auth.loggedInUser
  );

  const [isEditing, setIsEditing] = useState<boolean>(false);

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

  const onDeleteClick = async () => {
    try {
      await deleteComment(postId, comment.id);
      onDeleted();
    } catch (e) {
      alert("Error");
    }
  };

  const onEditClick = () => {
    setIsEditing(true);
  };

  const onCancelEditClick = () => {
    setIsEditing(false);
  };

  const isMine = loggedInUser!.id === comment.author.id;

  let commentContent = <CardTitle>{comment.content}</CardTitle>;
  if (isEditing) {
    commentContent = (
      <Formik
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={{
          content: comment.content,
        }}
        validationSchema={Yup.object({
          content: Yup.string().required("Please enter content!"),
        })}
        onSubmit={async (values) => {
          try {
            await updateComment(postId, comment.id, values.content);
            onEdited(values.content);
            setIsEditing(false);
          } catch (e) {
            alert("Error!");
            console.log(e);
          }
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <AuthForm onSubmit={handleSubmit}>
            <MyTextInput
              name="content"
              label="Content"
              placeholder="Enter post content"
              className="mb-0"
            />

            <div className="d-flex mt-3">
              <Button disabled={isSubmitting} type="submit">
                Update!
              </Button>
            </div>
          </AuthForm>
        )}
      </Formik>
    );
  }

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
            {commentContent}
            <p>Likes: {comment.likes.likesAmount}</p>
            <div className="d-flex">
              <Button onClick={likeOrUnlike}>
                {comment.likes.myLike ? "Unlike" : "Like"}
              </Button>
              {isMine && (
                <>
                  {isEditing ? (
                    <Button onClick={onCancelEditClick}>Cancel edit</Button>
                  ) : (
                    <Button onClick={onEditClick}>Edit</Button>
                  )}
                  <Button onClick={onDeleteClick}>Delete</Button>
                </>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};
