import React from 'react';
import { Link } from 'react-router'

import './WorkbookFooter.less';

export const WorkbookFooter = ({
  viewAllWbs,
  viewRecentWbs,
  viewFavoriteWbs
}) =>
  <div className="workbook-footer">
    <div className="col-xs-4">
      <a onClick={viewFavoriteWbs}>
        Favorites
      </a>
    </div>
    <div className="col-xs-4">
      <a onClick={viewRecentWbs}>
        Recent
      </a>
    </div>
    <div className="col-xs-4">
      <a onClick={viewAllWbs}>
        All
      </a>
    </div>
  </div>
