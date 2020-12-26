import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { searchUsers } from "../api/user.api";
import { Loading } from "../components/Loading";
import { UserList } from "../components/users/UserList";
import { UserExcerpt } from "../types/UserExcerpt";

export const SearchResults: React.FC<{}> = ({}) => {
  const location = useLocation();

  const [loadingSearch, setLoadingSearch] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<UserExcerpt[]>([]);

  useEffect(() => {
    async function search() {
      try {
        const searchParams = new URLSearchParams(location.search);
        const q = searchParams.get("q");
        if (q) {
          const fUsers = await searchUsers(q);
          setSearchResults(fUsers.data);
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
      <h3 className="mb-2">Search results</h3>
      <UserList users={searchResults} />
    </div>
  );
};
