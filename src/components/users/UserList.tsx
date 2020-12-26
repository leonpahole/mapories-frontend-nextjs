import React from "react";
import { Link } from "react-router-dom";
import { Avatar, Badge, Icon, Nav, Panel } from "rsuite";
import { useLoggedInUser } from "../../hooks/useLoggedInUser";
import { UserExcerpt } from "../../types/UserExcerpt";

interface UserList {
  users: UserExcerpt[];
  isFriendRequestList?: boolean;
  onAcceptFriendRequest?(userId: string): void;
  onDeclineFriendRequest?(userId: string): void;
}

export const UserList: React.FC<UserList> = ({
  users,
  isFriendRequestList = false,
  onAcceptFriendRequest,
  onDeclineFriendRequest,
}) => {
  const loggedInUser = useLoggedInUser();

  return (
    <div>
      {users.map((sr) => (
        <Panel
          header={
            <div className="d-flex justify-content-between">
              <div className="d-flex">
                <Avatar circle>
                  <Icon icon="user" />
                </Avatar>
                <div className="ml-2">
                  <div>
                    <p>
                      <Link to={`/profile/${sr.id}`} className="no-style-link">
                        <b>
                          {sr.name}{" "}
                          {loggedInUser!.id === sr.id ? (
                            <Badge content="You" />
                          ) : null}
                        </b>
                      </Link>
                    </p>
                    <Link to={`/profile/${sr.id}`}>
                      <small className="text-secondary c-pointer block mt-3 mb-3">
                        See profile
                      </small>
                    </Link>
                  </div>
                </div>
              </div>
              <div>
                {isFriendRequestList && (
                  <>
                    <Nav>
                      <Nav.Item
                        icon={
                          <Icon
                            size="2x"
                            style={{ color: "green" }}
                            icon="check-circle"
                          />
                        }
                        onClick={() =>
                          onAcceptFriendRequest && onAcceptFriendRequest(sr.id)
                        }
                      />
                      <Nav.Item
                        icon={
                          <Icon
                            size="2x"
                            style={{ color: "red" }}
                            icon="times-circle"
                          />
                        }
                        onClick={() =>
                          onDeclineFriendRequest &&
                          onDeclineFriendRequest(sr.id)
                        }
                      />
                    </Nav>
                  </>
                )}
              </div>
            </div>
          }
          bodyFill={true}
          bordered
        ></Panel>
      ))}
    </div>
  );
};
