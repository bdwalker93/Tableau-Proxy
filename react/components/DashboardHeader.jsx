import React from 'react';
import { Link } from 'react-router'
import { SearchForm } from './SearchForm';
import { Button } from 'react-bootstrap';
import Popover from './Popover';
import { SORT_OPTIONS, ORDER_OPTIONS } from '../sorting';

const FILTER_OPTIONS = [
  { id: 'ownerName', label: 'Owner Name' },
  { id: 'project', label: 'Project' },
  { id: 'format', label: 'Format' },
  { id: 'tag', label: 'Tag' }
];

export const DashboardHeader = ({
  params: { tab, sortId, orderId },
  search,
  sortOptions,
  orderOptions,
}) => {
  return <div className="container">
    <div className="row">
      <div className="col-xs-6" style={{padding:0}}>
        <SearchForm search={search} tab={tab} sortId={sortId} orderId={orderId} />
      </div>

      <div className="col-xs-3" style={{padding:0}}>
        <Popover id="filter-option" trigger={<Button block>Add Filter</Button>}>
          {FILTER_OPTIONS.map(filter=><div key={filter.id}>
            <Link to={`/app/workbooks/${tab}/${sortId}/${orderId}`}>{filter.label}</Link>
          </div>)}
        </Popover>
      </div>

      { tab === 'recent' ? null : 
          <div className="col-xs-3" style={{padding:0}}>
            <Popover id="sort-option" trigger={
              <Button block>{
                SORT_OPTIONS.find(i=>i.id === sortId).label
              }{
                <i style={{paddingLeft: '5px', color:'#717070'}}
                  className={`fa fa-chevron-${orderId === 'asc' ? 'up' : 'down'}`}
                  aria-hidden="true"></i>
              }</Button>
            }>
            {SORT_OPTIONS.map((sort, i)=><div key={sort.id} style={i===(SORT_OPTIONS.length-1) ? { borderBottom: 0 } : null }>
              <Link to={`/app/workbooks/${tab}/${sort.id}/${orderId}`}>{sort.label}
                { sortId === sort.id ? 
                    <i className="fa fa-check" aria-hidden="true"></i>
                    : null 
                }
              </Link>
            </div>)}
            <span key="section-order" className="section-name">ORDER</span>
            {ORDER_OPTIONS.map(order=><div key={order.id}>
              <Link to={`/app/workbooks/${tab}/${sortId}/${order.id}`}>{order.label}
                { orderId === order.id ? 
                    <i className="fa fa-check" aria-hidden="true"></i>
                    : null 
                }
              </Link>
            </div>)}
          </Popover>
        </div>
      }

    </div>
  </div>
}
