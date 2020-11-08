import React, { useEffect, useState } from "react";
import { getPostComments, createPost, createComment } from "../../api/post.api";
import { Comment } from "../../types/Comment";
import { Loading } from "../Loading";
import { CommentCard } from "./CommentCard";
import * as Yup from "yup";
import { Formik } from "formik";
import { AuthForm } from "../../pages/login";
import { MyTextInput } from "../formik/MyTextInput";
import { Button } from "shards-react";

export const updateCommentWithLikeOrUnlike = (
  c: Comment,
  isLike: boolean
): Comment => {
  return {
    ...c,
    likes: {
      myLike: isLike,
      likesAmount: c.likes.likesAmount + (isLike ? 1 : -1),
    },
  };
};

interface PostCommentsType {
  postId: string;
}

export const PostComments: React.FC<PostCommentsType> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const fComments = await getPostComments(postId, 0);
        setComments(fComments);
      } catch (e) {
        console.log(e);
      }

      setLoadingComments(false);
    }

    fetchPost();
  }, []);

  const modifyCommentWhenLikeOrUnlike = (comment: Comment, isLike: boolean) => {
    setComments((cList) => {
      return cList.map((c) => {
        if (c.id !== comment.id) {
          return c;
        }

        return updateCommentWithLikeOrUnlike(c, isLike);
      });
    });
  };

  if (loadingComments) {
    return <Loading />;
  }

  let commentList = null;

  if (comments.length === 0) {
    commentList = <p>No comments yet</p>;
  } else {
    commentList = (
      <>
        <Button>Load more</Button>
        <div>
          {comments.map((c) => {
            return (
              <CommentCard
                postId={postId}
                onLikeOrUnlike={(l) => modifyCommentWhenLikeOrUnlike(c, l)}
                comment={c}
              />
            );
          })}
        </div>
      </>
    );
  }

  return (
    <div>
      {commentList}
      <Formik
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={{
          content: null,
        }}
        validationSchema={Yup.object({
          content: Yup.string().required("Please enter content!"),
        })}
        onSubmit={async (values, { resetForm }) => {
          try {
            const comment = await createComment(postId, values.content!);
            setComments((c) => [...c, comment]);
            resetForm();
          } catch (e) {
            alert("Error!");
            console.log(e);
          }
        }}
      >
        {({ handleSubmit, isSubmitting, values }) => (
          <AuthForm onSubmit={handleSubmit}>
            <MyTextInput
              name="content"
              label="Content"
              placeholder="Enter post content"
              className="mb-0"
            />

            <div className="d-flex mt-3">
              <Button disabled={isSubmitting} type="submit">
                Comment!
              </Button>
            </div>
          </AuthForm>
        )}
      </Formik>
    </div>
  );
};
