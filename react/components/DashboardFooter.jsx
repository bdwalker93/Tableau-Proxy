import React from 'react';
import { Link } from 'react-router'

import './DashboardFooter.less';

export const DashboardFooter = () =>
  <div className="dashboard-footer">
    <div className="col-xs-4">
      <Link to="/app/workbooks/favorites">Favorite</Link>
    </div>
    <div className="col-xs-4">
      <Link to="/app/workbooks/recent">Recent</Link>
    </div>
    <div className="col-xs-4">
      <Link to="/app/workbooks/all">All</Link>
    </div>
  </div>
