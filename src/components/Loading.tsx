import React from "react";
import GridLoader from "react-spinners/GridLoader";

export const Loading = () => {
  return (
    <div className="flex flex-column justify-center items-center mt-5">
      <GridLoader size={20} loading={true} color="#007bff" />
      <p className="mt-2">Loading...</p>
    </div>
  );
};
