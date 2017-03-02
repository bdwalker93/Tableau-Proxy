import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import { WorkbookListItem } from './WorkbookListItem';
import { DashboardFooter } from './DashboardFooter';
import { DashboardHeader } from './DashboardHeader';
import { SORT_OPTIONS, ORDER_OPTIONS } from '../sorting';
import { Link } from 'react-router';

import InfiniteScroll from 'react-infinite-scroller';
import { Page } from './Page';
import { Toolbar } from './Toolbar';

import { SearchForm } from './SearchForm';
import { Button, Popover, OverlayTrigger } from 'react-bootstrap';

import cookies from "browser-cookies";

const getServerHostname = () => new URL(cookies.get('PROXY_TARGET')).hostname;

import './DashboardPage.less';
import './popover.less';

const Dashboard = (props) => {
  const {
    params: { tab, sortId, orderId },
    workbooksById,
    workbookIds,
    hasMore,
    loadMore,
    sites,
    currentSite,
    currentUser,

    addFavoriteWorkbook,
    deleteFavoriteWorkbook,
    viewFavoriteWorkbooks,
    viewRecentWorkbooks,
    switchSite,
    search,
    logout
  } = props;

  let mainMenuItems = [];

  mainMenuItems.push(
    <div>
      <a href="#" onClick={logout}>Sign Out</a>
    </div>
  )
  mainMenuItems.push(
    <div style={{borderBottom:0}}>
      <a href="https://github.com/bdwalker93/Tableau-Proxy/issues?utf8=%E2%9C%93&q=is%3Aissue">Help</a>
    </div>
  )
  if ( sites.length > 0 ) {
    mainMenuItems.push(
      <span className="section-name">SITES</span>
    )
    sites.map(site=>
      mainMenuItems.push(
        <div key={site.urlName}>
          <a href="#" onClick={()=>switchSite(site.urlName, tab)}>{site.name}</a>
          { currentSite.urlName === site.urlName ? 
              <i className="fa fa-check" aria-hidden="true"></i>
              : null 
          }
        </div>
      )
    )
  }

  return <Page>
    <Toolbar>
      <OverlayTrigger trigger="click" rootClose
        placement="bottom" overlay={<Popover id='main-menu'>{mainMenuItems}</Popover>}>
        <span>
          <img src="/img/logo.png" style={{height: '88%'}} />
          <span style={{
            color: '#505050',
            left: '50px',
            top: '5px',
            fontSize: '14px',
            position: 'absolute',
          }}>
          {currentUser.displayName}
        </span>
        <span style={{
          fontSize: '18px',
          position: 'absolute',
          color: '#262626',
          top: '20px',
          left: '50px',
          display: 'block' }}>
          {getServerHostname()}: {currentSite.name}
        </span>
      </span>
      </OverlayTrigger>
    </Toolbar>


    <SearchForm search={search} tab={tab} />

    <OverlayTrigger trigger="click" rootClose
      placement="bottom" overlay={<Popover id="sort-option">
        {SORT_OPTIONS.map(sort=><div key={sort.id}>
          <Link to={`/app/workbooks/${tab}/${sort.id}/${orderId}`}>{sort.label}</Link>
        { sortId === sort.id ? 
            <i className="fa fa-check" aria-hidden="true"></i>
            : null 
        }
      </div>)}
      <hr/>
      {ORDER_OPTIONS.map(order=><div key={order.id}>
        <Link to={`/app/workbooks/${tab}/${sortId}/${order.id}`}>{order.label}</Link>
        { orderId === order.id ? 
            <i className="fa fa-check" aria-hidden="true"></i>
            : null 
        }
      </div>)}
      </Popover>}>
      <Button>sort</Button>
    </OverlayTrigger>


    {/*
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
    */}

    <DashboardFooter />
  </Page>
}

function mapStateToProps(state) {
  return state.workbooks;
}

export const DashboardPage = connect(mapStateToProps, actionCreators)(Dashboard); 
