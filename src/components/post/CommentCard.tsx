import React, { useState } from "react";
import { Alert, Icon, Nav, Panel, Tooltip, Whisper } from "rsuite";
import {
  deleteComment,
  deleteCommentOnComment,
  likeComment,
  likeCommentOnComment,
  unlikeComment,
  unlikeCommentOnComment,
} from "../../api/post.api";
import { useLoggedInUser } from "../../hooks/useLoggedInUser";
import { Comment } from "../../types/Comment";
import { ConfirmDialog } from "../ConfirmDialog";
import { AuthorHeader } from "./AuthorHeader";
import { CommentsList } from "./CommentsList";
import { NewPostCommentInput } from "./NewPostCommentInput";

interface CommentCardProps {
  postId: string;
  commentId?: string;
  onLikeOrUnlike(isLike: boolean): void;
  onEdited(content: string): void;
  onDeleted(markedDeleted?: boolean, parentShouldBeDeleted?: boolean): void;
  onSecondLevelReplyClick(): void;
  comment: Comment;
}

export const CommentCard: React.FC<CommentCardProps> = ({
  postId,
  commentId,
  onLikeOrUnlike,
  comment,
  onEdited,
  onDeleted,
  onSecondLevelReplyClick,
}) => {
  const loggedInUser = useLoggedInUser();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showNewCommentInput, setShowNewCommentInput] = useState<boolean>(
    false
  );

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const likeOrUnlike = async () => {
    try {
      if (commentId) {
        if (comment.likes.myLike) {
          await unlikeCommentOnComment(commentId, comment.id);
        } else {
          await likeCommentOnComment(commentId, comment.id);
        }
      } else {
        if (comment.likes.myLike) {
          await unlikeComment(postId, comment.id);
        } else {
          await likeComment(postId, comment.id);
        }
      }

      onLikeOrUnlike(!comment.likes.myLike);
    } catch (e) {
      console.log(e);
      Alert.error("Error while reacting to the comment.", 5000);
    }
  };

  const onDelete = async () => {
    try {
      let markedDeleted = false;
      let parentShouldBeDeleted = false;
      if (commentId) {
        const deleteData = await deleteCommentOnComment(commentId, comment.id);
        parentShouldBeDeleted = deleteData.parentDeleted;
      } else {
        const deleteData = await deleteComment(postId, comment.id);
        markedDeleted = deleteData.markedDeleted;
      }

      onDeleted(markedDeleted, parentShouldBeDeleted);
      setShowDeleteModal(false);
      Alert.info("Comment deleted.", 5000);
    } catch (e) {
      console.log(e);
      Alert.error("Error while deleting the comment.", 5000);
    }
  };

  const isMine = loggedInUser!.id === comment.author.id;

  const onReplyClick = () => {
    if (commentId) {
      onSecondLevelReplyClick();
    } else {
      setShowNewCommentInput(!showNewCommentInput);
    }
  };

  const deletePostModal = (
    <ConfirmDialog
      show={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      onConfirm={onDelete}
      header={"Delete comment?"}
      text={"Really delete comment?"}
      confirmButtonText={"Delete"}
      confirmButtonColor={"red"}
    />
  );

  return (
    <>
      <div>
        <Panel
          className="comment-card-panel"
          header={
            <AuthorHeader
              linkTo={`#`}
              createdAt={comment.postedAt}
              author={comment.author}
              isMine={isMine}
              showEditAndDelete={!comment.deleted}
              onDelete={() => setShowDeleteModal(true)}
              onEdit={() => setIsEditing((e) => !e)}
            />
          }
        >
          <div>
            {isEditing ? (
              <NewPostCommentInput
                postId={postId}
                commentId={commentId}
                onCommentUpdate={(content) => {
                  onEdited(content);
                  setIsEditing(false);
                }}
                existingComment={comment}
              />
            ) : (
              <p>
                {comment.deleted ? (
                  <i>Comment deleted by author.</i>
                ) : (
                  comment.content
                )}
              </p>
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
            <Nav.Item
              onClick={onReplyClick}
              icon={
                <Whisper
                  placement="top"
                  trigger="hover"
                  speaker={<Tooltip>Reply</Tooltip>}
                >
                  <Icon icon={"reply"} size="lg" />
                </Whisper>
              }
              className="no-padding-navitem mr-2"
            ></Nav.Item>
          </Nav>
          {!commentId && (
            <>
              <CommentsList
                postId={postId}
                commentId={comment.id}
                replyToComment={showNewCommentInput ? comment : undefined}
                onAllCommentsDeleted={() => onDeleted()}
                onReplyCreated={() => setShowNewCommentInput(false)}
              />
            </>
          )}
        </Panel>
      </div>
      {deletePostModal}
    </>
  );
};
