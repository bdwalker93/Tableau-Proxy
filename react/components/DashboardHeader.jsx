import React from 'react';
import { Link } from 'react-router'

import './DashboardHeader.less';

export const DashboardHeader = ({
  logout, 
  total
}) =>
  <div className="dashboard-header">
    <div>
      <button onClick={logout}>Logout</button>
      {total}
    </div>
    <div> second layer</div>
  </div>
