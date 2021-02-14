import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Button, Carousel, Modal, Placeholder, Rate } from "rsuite";
import { getPostById } from "../../api/post.api";
import { Post } from "../../types/Post";
import { AuthorHeader } from "../post/AuthorHeader";
import { CarouselContainer, CarouselImage } from "../post/PostCard";
const { Paragraph } = Placeholder;

interface MaporyModal {
  open: boolean;
  onClose(): void;
  maporyId: string;
}

export const MaporyModal: React.FC<MaporyModal> = ({
  open,
  onClose,
  maporyId,
}) => {
  const [mapory, setMapory] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const history = useHistory();

  useEffect(() => {
    async function fetchMapory() {
      setLoading(true);

      try {
        const post = await getPostById(maporyId);
        if (post.post.mapory) {
          setMapory(post);
          setLoading(false);
        }
      } catch (e) {
        console.log(e);
      }
    }

    if (maporyId) {
      fetchMapory();
    }
  }, [maporyId]);

  let modalBody = <Paragraph />;

  if (!loading && mapory && mapory.post && mapory.post.mapory) {
    modalBody = (
      <div>
        <AuthorHeader
          linkTo={`/post/${mapory.post.id}`}
          post={mapory.post}
          createdAt={mapory.post.createdAt}
          author={mapory.author}
          isMine={false}
          showEditAndDelete={false}
        />
        <div className="d-flex justify-content-between mt-3">
          <div>
            {mapory.post.mapory && mapory.post.mapory.rating && (
              <Rate value={mapory.post.mapory.rating} readOnly size="xs" />
            )}
            <p className="multiline-text">{mapory.post.content}</p>
          </div>
        </div>
        <div>
          <div className="d-flex mt-3">
            {mapory.post.images && mapory.post.images.length > 0 && (
              <CarouselContainer style={{ maxWidth: "unset" }}>
                <Carousel
                  placement="right"
                  shape="dot"
                  className="custom-slider"
                  style={{ height: "300px" }}
                >
                  {mapory.post.images.map((p) => (
                    <CarouselImage src={`${p.url}`} height="300" />
                  ))}
                </Carousel>
              </CarouselContainer>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-container">
      <Modal show={open} onHide={onClose}>
        <Modal.Body style={{ marginTop: "15px" }}>{modalBody}</Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              if (mapory) {
                history.push(`post/${mapory.post.id}`);
              }
            }}
            appearance="primary"
          >
            View details
          </Button>
          <Button onClick={onClose} appearance="subtle">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
