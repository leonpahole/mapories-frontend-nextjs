import React from "react";
import { Loader } from "rsuite";

export const Loading = () => {
  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <Loader size="lg" content="Loading" vertical />
    </div>
  );
};
