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
import { MyTextInput } from "../form/MyTextInput";
import * as Yup from "yup";
import { CenteredForm } from "../../styledComponents/StyledForm";
import { Panel, Nav, Icon } from "rsuite";
import { AuthorHeader } from "./AuthorHeader";
import { NewPostCommentInput } from "./NewPostCommentInput";
import { useLoggedInUser } from "../../hooks/useLoggedInUser";

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
  const loggedInUser = useLoggedInUser();

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

  const isMine = loggedInUser!.id === comment.author.id;

  return (
    <div>
      <Panel
        header={
          <AuthorHeader
            linkTo={`#`}
            createdAt={comment.postedAt}
            author={comment.author}
            isMine={isMine}
            onDelete={() => onDeleteClick()}
            onEdit={() => setIsEditing((e) => !e)}
          />
        }
      >
        <div>
          {isEditing ? (
            <NewPostCommentInput
              postId={postId}
              onCommentUpdate={(content) => {
                onEdited(content);
                setIsEditing(false);
              }}
              existingComment={comment}
            />
          ) : (
            <p>{comment.content}</p>
          )}
        </div>
        <Nav className="mt-3">
          <Nav.Item
            onClick={likeOrUnlike}
            icon={
              <Icon
                icon={comment.likes.myLike ? "heart" : "heart-o"}
                size="lg"
                style={{ color: comment.likes.myLike ? "red" : undefined }}
              />
            }
            className="no-padding-navitem mr-2"
          >
            {comment.likes.likesAmount > 0 ? comment.likes.likesAmount : ""}
          </Nav.Item>
        </Nav>
      </Panel>
    </div>
  );
};
