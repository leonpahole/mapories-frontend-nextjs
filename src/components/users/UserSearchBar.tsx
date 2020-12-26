import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { AutoComplete, Icon, InputGroup } from "rsuite";
import { searchUsers } from "../../api/user.api";
import { useDebounce } from "../../hooks/useDebounce";
import { UserExcerpt } from "../../types/UserExcerpt";

export const UserSearchBar = () => {
  const [searchString, setSearchString] = useState<string>("");
  const [searchResults, setSearchResults] = useState<UserExcerpt[]>([]);

  const history = useHistory();
  const location = useLocation();

  const debounce = useDebounce();

  const doSearch = () => {
    history.push(`/search?q=${searchString.trim()}`);
  };

  const searchStringOnChange = (value: string, e: React.SyntheticEvent) => {
    if (e.type === "change") {
      setSearchString(value);
    }
  };

  useEffect(() => {
    debounceUserSearch();
  }, [searchString]);

  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(location.search);
      const q = searchParams.get("q");
      if (q) {
        setSearchString(q.trim());
      }
    } catch (e) {
      console.log(e);
    }
  }, [location]);

  const runUserSearch = async () => {
    const qCleared = searchString.trim();
    if (qCleared.length === 0) {
      setSearchResults([]);
      return;
    }

    try {
      const fUsers = await searchUsers(qCleared);
      setSearchResults(fUsers.data);
    } catch (e) {
      console.log(e);
    }
  };

  const debounceUserSearch = () => {
    debounce(
      () => {
        runUserSearch();
      },
      "search",
      500
    );
  };

  const onSelectUser = (item: any) => {
    setSearchString(item.label);
    history.push(`/profile/${item.value}`);
  };

  const searchStringSearchable = searchString.trim().length > 0;

  const autoCompleteData = searchResults.map((r) => ({
    label: r.name,
    value: r.id,
  }));

  return (
    <InputGroup
      inside
      style={{
        width: 300,
      }}
    >
      <AutoComplete
        value={searchString}
        data={autoCompleteData}
        onChange={searchStringOnChange}
        placeholder="Search users..."
        onSelect={onSelectUser}
        renderItem={(item) => {
          return (
            <div
              style={{
                width: 300,
              }}
            >
              {item.label}
            </div>
          );
        }}
      />
      <InputGroup.Button onClick={doSearch} disabled={!searchStringSearchable}>
        <Icon icon="search" />
      </InputGroup.Button>
    </InputGroup>
  );
};
