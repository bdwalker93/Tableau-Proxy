import React from 'react';
import { Link } from 'react-router'
import { Button, Popover, OverlayTrigger } from 'react-bootstrap';

export const DashboardHeader = ({
  tab,
  logout, 
  currentSite,
  sites,
  switchSite,
  search,
  total,
  sortId,
  sortOptions,
  orderId,
  orderOptions,
}) => {
  return <div className="dashboard-header">
    <div>

      <OverlayTrigger trigger="click" rootClose
        placement="bottom" overlay={<Popover id="sort-option">
          {sortOptions.map(sort=><div key={sort.id}>
            <Link to={`/app/workbooks/${tab}/${sort.id}/${orderId}`}>{sort.label}</Link>
          { sortId === sort.id ? 
              <i className="fa fa-check" aria-hidden="true"></i>
              : null 
          }
        </div>)}
        <hr/>
        {orderOptions.map(order=><div key={order.id}>
          <Link to={`/app/workbooks/${tab}/${sortId}/${order.id}`}>{order.label}</Link>
          { orderId === order.id ? 
              <i className="fa fa-check" aria-hidden="true"></i>
              : null 
          }
        </div>)}
        </Popover>}>
        <Button>sort</Button>
      </OverlayTrigger>

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
    <div>
    </div>
  </div>
}
