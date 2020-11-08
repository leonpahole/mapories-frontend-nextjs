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
import {
  PaginationInfo,
  defaultPaginationInfo,
} from "../profileTabs/userPostsList";

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
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>(
    defaultPaginationInfo
  );

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const fComments = await getPostComments(
        postId,
        paginationInfo.pageNumber
      );
      setComments([...comments, ...fComments.data]);
      setPaginationInfo({
        moreAvailable: fComments.moreAvailable,
        pageNumber: paginationInfo.pageNumber + 1,
      });
    } catch (e) {
      console.log(e);
      alert("Error");
    }

    setLoadingComments(false);
  };

  useEffect(() => {
    setPaginationInfo(defaultPaginationInfo);
    fetchComments();
  }, [postId]);

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

  const modifyCommentsWhenUpdate = (id: string, content: string) => {
    setComments((cList) => {
      return cList.map((c) => {
        if (c.id !== id) {
          return c;
        }

        return {
          ...c,
          content,
        };
      });
    });
  };

  const modifyCommentsWhenDelete = (id: string) => {
    setComments((cList) => {
      return cList.filter((c) => c.id !== id);
    });
  };

  if (comments.length === 0 && loadingComments) {
    return <Loading />;
  }

  let commentList = null;

  if (comments.length === 0) {
    commentList = <p>No comments yet</p>;
  } else {
    commentList = (
      <>
        <div>
          {comments.map((c) => {
            return (
              <CommentCard
                postId={postId}
                onLikeOrUnlike={(l) => modifyCommentWhenLikeOrUnlike(c, l)}
                comment={c}
                onEdited={(content: string) =>
                  modifyCommentsWhenUpdate(c.id, content)
                }
                onDeleted={() => modifyCommentsWhenDelete(c.id)}
              />
            );
          })}
        </div>
      </>
    );
  }

  return (
    <div>
      <Formik
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={{
          content: "",
        }}
        validationSchema={Yup.object({
          content: Yup.string().required("Please enter content!"),
        })}
        onSubmit={async (values, { resetForm }) => {
          try {
            const comment = await createComment(postId, values.content!);
            setComments((c) => [comment, ...c]);
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
      {commentList}
      {loadingComments && <Loading />}
      {!loadingComments && paginationInfo.moreAvailable && (
        <Button onClick={fetchComments}>Load more</Button>
      )}
    </div>
  );
};
