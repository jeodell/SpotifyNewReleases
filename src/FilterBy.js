import React from 'react'

export default function FilterBy(props) {
  return (
    <div className='filter'>
      <span>Filter by:</span>
      <input
        className='filter-input'
        type='radio'
        name='artist'
        id='artist-radio'
        onChange={(event) => {
          document.getElementById('date-radio').checked = false
          props.onChange(event.target.name)
        }}
      />
      <label style={{ marginLeft: '5px', marginRight: '5px' }}>
        Artist Name
      </label>
      <input
        className='filter-input'
        type='radio'
        name='date'
        id='date-radio'
        onChange={(event) => {
          document.getElementById('artist-radio').checked = false
          props.onChange(event.target.name)
        }}
      />
      <label style={{ marginLeft: '5px', marginRight: '5px' }}>
        Release Date
      </label>
    </div>
  )
}
