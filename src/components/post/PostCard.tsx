import React, { useState } from "react";
import { Alert, Carousel, Icon, Nav, Panel, Rate } from "rsuite";
import styled from "styled-components";
import { deletePost, likePost, unlikePost } from "../../api/post.api";
import { useLoggedInUser } from "../../hooks/useLoggedInUser";
import { Post } from "../../types/Post";
import { ConfirmDialog } from "../ConfirmDialog";
import { Map } from "../map/Map";
import { AuthorHeader } from "./AuthorHeader";
import { CommentsList } from "./CommentsList";
import { CreateNewPostOrMaporyModal } from "./CreateNewPostOrMaporyModal";

export const CarouselContainer = styled.div`
  width: 100%;
  max-width: 400px;
  height: 300px;
`;

export const CarouselImage = styled.img`
  object-fit: cover;
`;

const MapContainer = styled.div`
  width: 100%;
  max-width: 400px;
  height: 300px;
`;

interface PostCardProps {
  postInfo: Post;
  onLikeOrUnlike(isLike: boolean): void;
  onUpdate(p: Post): void;
  onDelete(): void;
}

export const PostCard: React.FC<PostCardProps> = ({
  postInfo,
  onLikeOrUnlike,
  onUpdate,
  onDelete,
}) => {
  const { post, author } = postInfo;

  const [displayComments, setDisplayComments] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const loggedInUser = useLoggedInUser();

  const likeOrUnlike = async () => {
    try {
      if (post.likes.myLike) {
        await unlikePost(post.id);
      } else {
        await likePost(post.id);
      }

      onLikeOrUnlike(!post.likes.myLike);
    } catch (e) {
      Alert.error("Try again.");
      console.log(e);
    }
  };

  const isMapory = post.mapory != null;
  const isMine = loggedInUser!.id === author.id;

  const onUpdatePost = (p: Post) => {
    setShowUpdateModal(false);
    onUpdate(p);
  };

  const updatePostModal = (
    <CreateNewPostOrMaporyModal
      show={showUpdateModal}
      size={"lg"}
      postToUpdate={post}
      onUpdate={onUpdatePost}
      onHide={() => {
        setShowUpdateModal(false);
      }}
    />
  );

  const onDeletePost = async () => {
    try {
      await deletePost(post.id);
      Alert.success("Post deleted.", 5000);
      setShowDeleteModal(false);
      onDelete();
    } catch (e) {
      console.log("Delete post error");
      console.log(e);
      Alert.error("Error while deleting the post.", 0);
    }
  };

  const deletePostModal = (
    <ConfirmDialog
      show={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      onConfirm={onDeletePost}
      header={"Delete post?"}
      text={
        "Really delete post? All comments and pictures will be deleted (for ever)."
      }
      confirmButtonText={"Delete"}
      confirmButtonColor={"red"}
    />
  );

  return (
    <>
      <div className="mb-4">
        <Panel
          header={
            <AuthorHeader
              linkTo={`/post/${post.id}`}
              post={post}
              createdAt={post.createdAt}
              author={author}
              isMine={isMine}
              onEdit={() => {
                setShowUpdateModal(true);
              }}
              onDelete={() => {
                setShowDeleteModal(true);
              }}
            />
          }
          shaded
        >
          <div className="d-flex justify-content-between">
            <div className="flex-grow-1">
              {post.mapory && post.mapory.rating && (
                <Rate value={post.mapory.rating} readOnly size="xs" />
              )}
              <p className="multiline-text">{post.content}</p>
            </div>
            <div className="d-flex justify-content-end" style={{ flex: "2" }}>
              {post.images && post.images.length > 0 && (
                <CarouselContainer>
                  <Carousel
                    placement="right"
                    shape="dot"
                    className="custom-slider"
                    style={{ height: "300px" }}
                  >
                    {post.images.map((p) => (
                      <CarouselImage
                        key={p.url}
                        src={`${p.url}`}
                        height="300"
                      />
                    ))}
                  </Carousel>
                </CarouselContainer>
              )}
              {isMapory && (
                <MapContainer className="ml-3">
                  <Map
                    markers={[{ location: post.mapory!.location, id: post.id }]}
                    height="300px"
                  />
                </MapContainer>
              )}
            </div>
          </div>
          <Nav className="mt-3">
            <Nav.Item
              onClick={likeOrUnlike}
              icon={
                <Icon
                  icon={post.likes.myLike ? "heart" : "heart-o"}
                  size="lg"
                  style={{ color: post.likes.myLike ? "red" : undefined }}
                />
              }
              className="no-padding-navitem mr-2"
            >
              {post.likes.likesAmount > 0 ? post.likes.likesAmount : ""}
            </Nav.Item>
            <Nav.Item
              onClick={() => setDisplayComments((dc) => !dc)}
              icon={<Icon icon="comments-o" size="lg" />}
              className="no-padding-navitem"
            />
          </Nav>
          {displayComments && (
            <>
              <hr />
              <CommentsList postId={post.id} />
            </>
          )}
        </Panel>
      </div>
      {updatePostModal}
      {deletePostModal}
    </>
  );
};
