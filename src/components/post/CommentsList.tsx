import React, { useEffect, useState } from "react";
import { getCommentComments, getPostComments } from "../../api/post.api";
import { Comment } from "../../types/Comment";
import { PaginatedResponse } from "../../types/PaginatedResponse";
import { Loading } from "../Loading";
import { CommentCard } from "./CommentCard";
import { NewPostCommentInput } from "./NewPostCommentInput";
import { defaultPaginationInfo, PaginationInfo } from "./PostsList";

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

interface CommentsListType {
  postId: string;
  commentId?: string;
  replyToComment?: Comment;
  onAllCommentsDeleted?(): void;
  onReplyCreated?(): void;
}

export const CommentsList: React.FC<CommentsListType> = ({
  postId,
  commentId,
  replyToComment,
  onAllCommentsDeleted,
  onReplyCreated,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState<boolean>(true);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>(
    defaultPaginationInfo
  );

  const [
    currentReplyToComment,
    setCurrentReplyToComment,
  ] = useState<Comment | null>(null);

  useEffect(() => {
    if (replyToComment) {
      setCurrentReplyToComment(replyToComment);
    }
  }, [replyToComment]);

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const pageSize = 3;

      let fComments: PaginatedResponse<Comment> | null = null;
      if (commentId) {
        fComments = await getCommentComments(
          commentId,
          paginationInfo.pageNumber,
          pageSize
        );
      } else {
        fComments = await getPostComments(
          postId,
          paginationInfo.pageNumber,
          pageSize
        );
      }

      if (fComments) {
        setComments([...fComments.data.reverse(), ...comments]);
        setPaginationInfo({
          moreAvailable: fComments.moreAvailable,
          pageNumber: paginationInfo.pageNumber + 1,
        });
      }
    } catch (e) {
      console.log(e);
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

  const modifyCommentsWhenDelete = (
    id: string,
    markedDeleted: boolean = false,
    parentShouldBeDeleted: boolean = false
  ) => {
    if (markedDeleted) {
      setComments((cList) => {
        return cList.map((c) => {
          if (c.id !== id) {
            return c;
          }

          return {
            ...c,
            content: "",
            deleted: true,
          };
        });
      });
    } else {
      setComments((cList) => cList.filter((c) => c.id !== id));
      if (parentShouldBeDeleted) {
        onAllCommentsDeleted && onAllCommentsDeleted();
      }
    }
  };

  const onReply = (c: Comment) => {
    setCurrentReplyToComment(c);
    // scrollIntoInput();
  };

  if (comments.length === 0 && loadingComments) {
    return <Loading />;
  }

  let commentList = null;

  if (comments.length === 0) {
    commentList = commentId ? null : <p>No comments yet.</p>;
  } else {
    commentList = (
      <>
        <div>
          {comments.map((c) => {
            return (
              <CommentCard
                key={c.id}
                postId={postId}
                commentId={commentId}
                onLikeOrUnlike={(l) => modifyCommentWhenLikeOrUnlike(c, l)}
                comment={c}
                onEdited={(content: string) =>
                  modifyCommentsWhenUpdate(c.id, content)
                }
                onDeleted={(
                  markedDeleted?: boolean,
                  parentShouldBeDeleted?: boolean
                ) =>
                  modifyCommentsWhenDelete(
                    c.id,
                    markedDeleted,
                    parentShouldBeDeleted
                  )
                }
                onSecondLevelReplyClick={() => onReply(c)}
              />
            );
          })}
        </div>
      </>
    );
  }

  return (
    <div>
      {!loadingComments && paginationInfo.moreAvailable && (
        <p
          onClick={fetchComments}
          style={{ cursor: "pointer", marginLeft: "20px", marginTop: "10px" }}
        >
          <b>Load more {commentId ? "replies" : "comments"}</b>
        </p>
      )}
      {loadingComments && <Loading />}
      {commentList}
      {(!commentId || currentReplyToComment) && (
        <NewPostCommentInput
          postId={postId}
          commentId={commentId}
          replyToUser={currentReplyToComment?.author.name}
          onCommentCreate={(comment) => {
            setCurrentReplyToComment(null);
            setComments((c) => [...c, comment]);
            onReplyCreated && onReplyCreated();
          }}
        />
      )}
    </div>
  );
};
