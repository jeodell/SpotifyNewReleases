import React from "react";

export default function FilterArtist(props) {
  return (
    <div className="filter">
      <span>Filter by Artist:</span>
      <input
        className="filter-input"
        type="text"
        onKeyUp={event => props.onTextChange(event.target.value)}
      />
    </div>
  );
}
