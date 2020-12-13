import React, { useCallback, useState } from "react";
import { FlyToInterpolator } from "react-map-gl";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Carousel, Icon, Nav, Panel, Rate } from "rsuite";
import { Button, Card, CardBody, CardTitle } from "shards-react";
import styled from "styled-components";
import { deletePost, likePost, unlikePost } from "../../api/post.api";
import { Map } from "../map/Map";
import { RootStore } from "../../redux/store";
import { Post } from "../../types/Post";
import { AuthorHeader } from "./AuthorHeader";
import { PostComments } from "./PostComments";
import { useLoggedInUser } from "../../hooks/useLoggedInUser";
import { CreateNewPostOrMaporyInput } from "./CreateNewPostOrMaporyInput";
import { CreateNewPostOrMaporyModal } from "./CreateNewPostOrMaporyModal";

const CarouselContainer = styled.div`
  width: 100%;
  max-width: 400px;
  height: 300px;
`;

const CarouselImage = styled.img`
  object-fit: cover;
`;

const MapContainer = styled.div`
  width: 100%;
  max-width: 400px;
  height: 300px;
`;

interface PostCardProps {
  postInfo: Post;
  showAuthor?: boolean;
  showSeeDetails?: boolean;
  onLikeOrUnlike(isLike: boolean): void;
  showMap?: boolean;
  showComments?: boolean;
  onUpdate(p: Post): void;
  onDelete(): void;
}

export const PostCard: React.FC<PostCardProps> = ({
  postInfo,
  showAuthor = false,
  showSeeDetails = false,
  onLikeOrUnlike,
  onUpdate,
  onDelete,
  showMap = false,
  showComments = false,
}) => {
  const { post, author } = postInfo;

  const [displayComments, setDisplayComments] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);

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
      alert("Error!");
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
                console.log();
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
                        src={`${process.env.REACT_APP_API_URL}/${p.url}`}
                        height="300"
                      />
                    ))}
                  </Carousel>
                </CarouselContainer>
              )}
              {isMapory && (
                <MapContainer className="ml-3">
                  <Map markers={[post.mapory!.location]} height="300px" />
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
              <PostComments postId={post.id} />
            </>
          )}
        </Panel>
      </div>
      {updatePostModal}
    </>
  );
};
