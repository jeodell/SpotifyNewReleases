import React from 'react'

export default function Pagination({ gotoNextPage, gotoPrevPage }) {
  // destructuring props
  return (
    <div>
      {gotoPrevPage && <button onClick={gotoPrevPage}>Previous</button>}
      {gotoNextPage && <button onClick={gotoNextPage}>Next</button>}
    </div>
  )
}
