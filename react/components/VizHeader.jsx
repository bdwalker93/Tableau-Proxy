import React from 'react';
import { Link } from 'react-router'

import './VizHeader.less';

export const VizHeader = ({
  views
}) =>
  <div className="viz-header">
    <button onClick={()=>{
      window.history.back()
    }}>
    back
  </button>

  <ul>
    {views.map(view=><li key={view.id}>
      <span>{view.isFavorite ? 'fav' : 'nofav'}</span> <Link to={`/app/workbooks/${view.workbookId}/views/${view.path}`}>{view.name}</Link>
    </li>)}

  </ul>
</div>
