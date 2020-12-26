import React from "react";
import { Link } from "react-router-dom";
import { Avatar, Icon, Nav } from "rsuite";
import { PostExcerpt } from "../../types/Post";
import { UserExcerpt } from "../../types/UserExcerpt";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface AuthorHeaderProps {
  author: UserExcerpt;
  post?: PostExcerpt;
  linkTo: string;
  createdAt: Date;
  isMine: boolean;
  showEditAndDelete?: boolean;
  onEdit?(): void;
  onDelete?(): void;
}

export const AuthorHeader: React.FC<AuthorHeaderProps> = ({
  author,
  post,
  linkTo,
  isMine,
  createdAt,
  showEditAndDelete = true,
  onEdit,
  onDelete,
}) => {
  const fromNow = dayjs(createdAt).fromNow();
  let placeText: string = "";
  if (post && post.mapory) {
    placeText = ` was at ${post.mapory.placeName} ${dayjs(
      post.mapory.visitDate
    ).fromNow()}`;
  }

  return (
    <div className="d-flex justify-content-between align-items-start">
      <div className="d-flex">
        <Avatar circle>
          <Icon icon="user" />
        </Avatar>
        <div className="ml-2">
          <p>
            <Link to={`/profile/${author.id}`} className="no-style-link">
              <b>{author.name}</b>
            </Link>
            {placeText}
          </p>
          <Link to={linkTo} className="no-style-link">
            <small>Posted {fromNow}</small>
          </Link>
        </div>
      </div>
      {isMine && showEditAndDelete && (
        <Nav>
          <Nav.Item
            icon={<Icon icon="edit" />}
            onClick={() => onEdit && onEdit()}
          />
          <Nav.Item
            icon={<Icon style={{ color: "red" }} icon="trash" />}
            onClick={() => onDelete && onDelete()}
          />
        </Nav>
      )}
    </div>
  );
};
