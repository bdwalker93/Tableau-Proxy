import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import { WorkbookListItem } from './WorkbookListItem';
import { DashboardFooter } from './DashboardFooter';
import { DashboardHeader } from './DashboardHeader';
import { Link } from 'react-router';

import InfiniteScroll from 'react-infinite-scroller';
import { Page } from './Page';
import { Toolbar } from './Toolbar';

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
    addFavoriteView,
    deleteFavoriteWorkbook,
    deleteFavoriteView,
    viewFavoriteWorkbooks,
    viewRecentWorkbooks,
    switchSite,
    search,
    logout
  } = props;

  let mainMenuItems = [];

  mainMenuItems.push(
    <div key="logout">
      <a href="#" onClick={logout}>Sign Out</a>
    </div>
  )
  mainMenuItems.push(
    <div key="help" style={{borderBottom:0}}>
      <a href="https://github.com/bdwalker93/Tableau-Proxy/issues?utf8=%E2%9C%93&q=is%3Aissue">Help</a>
    </div>
  )
  if ( sites.length > 0 ) {
    mainMenuItems.push(
      <span key="section-sites" className="section-name">SITES</span>
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
          <img src="/img/logo.png" style={{
            width: '32px',
            margin: '6px 10px'
          }} />
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
      <DashboardHeader {...props} />
    </Toolbar>

    <div style={{ height: '72px' }} />

    <InfiniteScroll
      className="container"
      pageStart={0}
      loadMore={loadMore}
      initialLoad={true}
      hasMore={hasMore}
      loader={<div className="loader">Loading ...</div>}
      useWindow={true}
      threshold={500}
    >
      { workbookIds.map(jid => <WorkbookListItem key={jid} tab={tab}
        workbook={workbooksById[jid]} isFav={workbooksById[jid].isFavorite}
        onFavorite={() => {
          const item  = workbooksById[jid];
          if ( item.isFavorite ) {
            if ( item.isWorkbook ) {
              deleteFavoriteWorkbook(jid);
            } else {
              deleteFavoriteView(item.id);
            }
          } else {
            if ( item.isWorkbook ) {
              addFavoriteWorkbook(jid);
            } else {
              addFavoriteView(item.id);
            }
          }
        }}
      />)
      }
    </InfiniteScroll>

    <DashboardFooter activeTab={tab}/>
  </Page>
}

function mapStateToProps(state) {
  return state.workbooks;
}

export const DashboardPage = connect(mapStateToProps, actionCreators)(Dashboard); 
