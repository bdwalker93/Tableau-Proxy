import React from 'react';
import { Link } from 'react-router'

import './DashboardFooter.less';

export const DashboardFooter = (props) =>
  <div className="dashboard-footer">
    <div className="col-xs-4 tab">
      <Link style={{color: props.activeTab === 'favorites' ? '#eb8f50': ''}} className="tab-text" to="/app/workbooks/favorites">Favorite</Link>
    </div>
    <div className="col-xs-4 tab">
      <Link style={{color: props.activeTab === 'recent' ? '#eb8f50': ''}} className="tab-text" to="/app/workbooks/recent">Recent</Link>
    </div>
    <div className="col-xs-4 tab">
      <Link style={{color: props.activeTab === 'all' ? '#eb8f50': ''}} className="tab-text" to="/app/workbooks/all">All</Link>
    </div>
  </div>

