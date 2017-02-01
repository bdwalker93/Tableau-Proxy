import React from 'react';
import { Link } from 'react-router'

import './DashboardHeader.less';

export const DashboardHeader = ({
  logout
}) =>
  <div className="dashboard-header">
    <div>
      <button onClick={logout}>Logout</button>
    </div>
    <div> second layer</div>
  </div>
