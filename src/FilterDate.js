import React from 'react'

export default function FilterDate(props) {
  return (
    <div className='filter'>
      <span>Filter by Date:</span>
      <input className='filter-input' type="date" onChange={event =>
        props.onChange(event.target.value)}/>
    </div>
  );
}
