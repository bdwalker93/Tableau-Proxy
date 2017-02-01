import React from 'react';
import { Link } from 'react-router'

import './DashboardFooter.less';

export const DashboardFooter = ({
  viewAllWbs,
  viewRecentWbs,
  viewFavoriteWbs
}) =>
  <div className="dashboard-footer">
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
