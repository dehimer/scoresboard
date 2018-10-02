import React from 'react'

export default (props) => (
  <div>
    <h3>Tournament Table</h3>
    { props.limit ? `limit: ${props.limit}` : 'Not limits' }
  </div>
)
