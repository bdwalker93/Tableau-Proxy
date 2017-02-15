import React from 'react';
import { Link } from 'react-router'
import { Button, Popover, OverlayTrigger } from 'react-bootstrap';

import './DashboardHeader.less';

export const DashboardHeader = ({
  tab,
  logout, 
  currentSite,
  sites,
  switchSite,
  total
}) => {
  return <div className="dashboard-header">
    <div>
      <OverlayTrigger trigger="click" rootClose
        placement="bottom" overlay={<Popover id="site-switcher">
          {sites.map(site=><div key={site.urlName}>
            <a href="#" onClick={()=>switchSite(site.urlName, tab)}>{site.name}</a>
          { currentSite.urlName === site.urlName ? 
              <i className="fa fa-check" aria-hidden="true"></i>
              : null 
          }
        </div>)}
        </Popover>}>
        <Button>sites</Button>
      </OverlayTrigger>
      <Button onClick={logout}>Logout</Button>
    </div>
    <div> second layer</div>
  </div>
}
