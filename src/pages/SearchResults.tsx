import React, { useEffect, useState } from "react";
import { useQuery } from "../utils/useQuery";
import { searchUsers } from "../api/user.api";
import { UserProfileData } from "../types/UserProfile";
import { Loading } from "../components/Loading";
import { useLocation, Link } from "react-router-dom";
import { Card, CardBody, CardTitle } from "shards-react";
import { useSelector } from "react-redux";
import { RootStore } from "../redux/store";

export const SearchResults: React.FC<{}> = ({}) => {
  const location = useLocation();

  const [loadingSearch, setLoadingSearch] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<UserProfileData[]>([]);

  const loggedInUser = useSelector(
    (state: RootStore) => state.auth.loggedInUser
  );

  useEffect(() => {
    async function search() {
      try {
        const searchParams = new URLSearchParams(location.search);
        const q = searchParams.get("q");
        if (q) {
          const fUsers = await searchUsers(q);
          setSearchResults(fUsers);
        }
      } catch (e) {
        console.log(e);
      }

      setLoadingSearch(false);
    }

    search();
  }, [location]);

  if (loadingSearch) {
    return <Loading />;
  }

  if (searchResults.length === 0) {
    return <p>No results!</p>;
  }

  return (
    <div>
      {searchResults.map((sr) => (
        <Card className="mb-3">
          <CardBody>
            <CardTitle>
              {sr.name} {loggedInUser!.id === sr.id ? "(You)" : ""}
            </CardTitle>
            <Link to={`/profile/${sr.id}`}>
              <small className="text-secondary c-pointer block mt-3 mb-3">
                See profile
              </small>
            </Link>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
