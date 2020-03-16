import React from "react";

export default function FilterDate(props) {
    let today = new Date();
    let filterDate =
        (today.getMonth() - 2 === 0 ? today.getFullYear() - 1 : today.getFullYear()) +
        "-" +
        (today.getMonth() - 2 === 0 ? 12 : today.getMonth() - 2) +
        "-" +
        today.getDate()
    return (
        <div className="filter">
            <span>Filter by Date:</span>
            <input
                className="filter-input"
                placeholder="2020-01-01"
                type="date"
                onChange={event => {
                    if (event.target.value === "") {
                        props.onChange(filterDate);
                    } else {
                        props.onChange(event.target.value);
                    }
                }}
            />
        </div>
    );
}
