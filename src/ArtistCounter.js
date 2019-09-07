import React from 'react'

export default function ArtistCounter(props) {
  let artists = props.artists
  return (
    <div className='artist-counter'>
      <h2>{artists.length} followed artists</h2>
    </div>
  );
}
