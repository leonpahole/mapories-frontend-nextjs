import React from "react";

const LogEntryForm = () => {
  return (
    <form>
      <label>Title</label>
      <input name="title" required />
      <label>Comments</label>
      <input name="comments" />
      <label>Description</label>
      <input name="description" />
      <button type="submit">Add</button>
    </form>
  );
};

export default LogEntryForm;
