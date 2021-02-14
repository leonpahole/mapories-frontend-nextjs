import { Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import {
  createComment,
  createCommentOnComment,
  updateComment,
  updateCommentOnComment,
} from "../../api/post.api";
import { CenteredForm } from "../../styledComponents/StyledForm";
import { Comment } from "../../types/Comment";
import { MyTextInput } from "../form/MyTextInput";
import { Alert, Avatar, Icon } from "rsuite";

interface NewPostCommentInputProps {
  onCommentCreate?: (comment: Comment) => void;
  onCommentUpdate?: (content: string) => void;
  postId: string;
  commentId?: string;
  existingComment?: Comment;
  replyToUser?: string;
}

export const NewPostCommentInput: React.FC<NewPostCommentInputProps> = ({
  onCommentCreate,
  onCommentUpdate,
  postId,
  commentId,
  existingComment,
  replyToUser,
}) => {
  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      initialValues={{
        content: existingComment
          ? existingComment.content
          : replyToUser
          ? "@" + replyToUser + " "
          : "",
      }}
      validationSchema={Yup.object({
        content: Yup.string().required("Please enter content!"),
      })}
      onSubmit={async (values, { resetForm, setErrors }) => {
        try {
          if (commentId) {
            if (existingComment) {
              await updateCommentOnComment(
                commentId,
                existingComment.id,
                values.content
              );

              Alert.info("Comment updated.");
              onCommentUpdate && onCommentUpdate(values.content);
            } else {
              const comment = await createCommentOnComment(
                commentId,
                values.content!
              );
              onCommentCreate && onCommentCreate(comment);
            }
          } else {
            if (existingComment) {
              await updateComment(postId, existingComment.id, values.content);

              Alert.info("Comment updated.");
              onCommentUpdate && onCommentUpdate(values.content);
            } else {
              const comment = await createComment(postId, values.content!);
              onCommentCreate && onCommentCreate(comment);
            }
          }

          resetForm();
        } catch (e) {
          setErrors({
            content: "Unknown error has occured! Please try again.",
          });
          console.log(e);
        }
      }}
    >
      {({ handleSubmit }) => (
        <CenteredForm
          fluid
          onSubmit={handleSubmit}
          style={{ maxWidth: "unset" }}
          className={commentId ? `reply-input` : ""}
        >
          <div className="d-flex align-items-center">
            {existingComment == null && (
              <Avatar circle className="mr-2">
                <Icon icon="user" />
              </Avatar>
            )}
            <div style={{ flex: 1 }}>
              <MyTextInput
                name="content"
                placeholder={
                  existingComment == null
                    ? commentId
                      ? "Write a reply"
                      : "Do you have anything to say about this post?"
                    : ""
                }
                size="lg"
              />
            </div>
          </div>
        </CenteredForm>
      )}
    </Formik>
  );
};
