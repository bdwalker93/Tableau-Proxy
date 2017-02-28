import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import { WorkbookListItem } from './WorkbookListItem';
import { DashboardFooter } from './DashboardFooter';
import { DashboardHeader } from './DashboardHeader';
import { SORT_OPTIONS, ORDER_OPTIONS } from '../sorting';

import InfiniteScroll from 'react-infinite-scroller';
import { Page } from './Page';
import { Toolbar } from './Toolbar';

import { SearchForm } from './SearchForm';

import './DashboardPage.less';

const Dashboard = (props) => {
  const {
    params: { tab, sortId, orderId },
    workbooksById,
    workbookIds,
    hasMore,
    loadMore,
    sites,
    currentSite,

    addFavoriteWorkbook,
    deleteFavoriteWorkbook,
    viewFavoriteWorkbooks,
    viewRecentWorkbooks,
    switchSite,
    search,
    logout
  } = props;

  return <Page>
    <Toolbar>
        <span style={{color: '#ccc', fontSize: '5px'}}>UserName</span>
        <span style={{fontSize: '10px'}}>Server</span>
    </Toolbar>

    <SearchForm search={search} tab={tab} />

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


    <InfiniteScroll
      pageStart={0}
      loadMore={loadMore}
      initialLoad={true}
      hasMore={hasMore}
      loader={<div className="loader">Loading ...</div>}
      useWindow={true}
      threshold={500}
    >
      { workbookIds.map(id => <WorkbookListItem key={id} tab={tab}
        workbook={workbooksById[id]} isFav={workbooksById[id].isFavorite}
        onFavorite={() => {
          if ( workbooksById[id].isFavorite ) {
            deleteFavoriteWorkbook(id);
          } else {
            addFavoriteWorkbook(id);
          }
        }}
      />)
      }
    </InfiniteScroll>

    <DashboardFooter />
  </Page>
}

function mapStateToProps(state) {
  return state.workbooks;
}

export const DashboardPage = connect(mapStateToProps, actionCreators)(Dashboard); 
