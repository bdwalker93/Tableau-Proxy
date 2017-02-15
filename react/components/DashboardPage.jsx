import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import { WorkbookListItem } from './WorkbookListItem';
import { DashboardFooter } from './DashboardFooter';
import { DashboardHeader } from './DashboardHeader';

import InfiniteScroll from 'react-infinite-scroller';

import './DashboardPage.less';

const Dashboard = (props) => {
  const {
    params: { tab },
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

  return <div className="dashboard-page">

    <DashboardHeader
      logout={logout}
      total={workbookIds.length}
      sites={sites}
      currentSite={currentSite}
      switchSite={switchSite}
      tab={tab}
      search={search}
    />

    <div className="dashboard-content">
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
    </div>
    
    <DashboardFooter />
  </div>
}

function mapStateToProps(state) {
  return state.workbooks;
}

export const DashboardPage = connect(mapStateToProps, actionCreators)(Dashboard); 
