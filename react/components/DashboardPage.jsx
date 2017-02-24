import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import { WorkbookListItem } from './WorkbookListItem';
import { DashboardFooter } from './DashboardFooter';
import { DashboardHeader } from './DashboardHeader';
import { SORT_OPTIONS, ORDER_OPTIONS } from '../sorting';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';

import InfiniteScroll from 'react-infinite-scroller';

import './DashboardPage.less';

import {Page, Toolbar, Icon, ToolbarButton, Popover, List, ListItem, Button, Tabbar, Tab} from 'react-onsenui';

import cookies from "browser-cookies";

const Stub = React.createClass({
  render: () => {
    return <Page></Page>;
  }
});

const getServerHostname = () => new URL(cookies.get('PROXY_TARGET')).hostname;

const tabMap = {
  favorites: 0,
  recent: 1,
  all: 2
}


const tabList = [
  'favorites',
  'recent',
  'all'
]

const Dashboard = React.createClass({
  getInitialState: function() {
    const tabIndex = tabMap[this.props.params.tab];
    console.log('tab',this.props.params.tab);
    console.log('tabindex', tabIndex);
    return {
      isOpen: false,
      tabIndex
    };
  },
  showPopover: function() {
    this.setState({ isOpen: true });
  },
  hidePopover: function() {
    this.setState({ isOpen: false });
  },
  getTarget: function() {
    return this.refs.dashboardPage.refs.tableauIcon;
  },
  render: function() {
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
    } = this.props;

    return <Page ref="dashboardPage" renderToolbar={()=><Toolbar>
        <div className='left' onClick={this.showPopover} style={{
          width: '50px',
          textAlign: 'center' }}>
          <img src="/img/logo.png" style={{height: '88%'}} ref="tableauIcon"/>
        </div>
        <div className='center' onClick={this.showPopover} style={{
          textAlign: 'initial',
          fontWeight: 'normal' }}>
          <span style={{
            color: '#505050',
            fontSize: '14px',
            position: 'absolute',
            bottom:'10px' }}>
            {currentUser.displayName}
          </span>
          <span style={{
            fontSize: '18px',
            position: 'absolute',
            color: '#262626',
            top: '8px',
            display: 'block' }}>
            {getServerHostname()}: {currentSite.name}
          </span>
        </div>
      </Toolbar> }>


      <Popover
        isOpen={this.state.isOpen}
        onOpen={this.showPopover}
        onHide={this.hidePopover}
        onCancel={this.hidePopover}
        getTarget={this.getTarget}
      >
        <List
          style={{marginTop: '5px'}}
          modifier='noborder'
          dataSource={[{
            label: "Logout",
            onClick: logout
          },...sites.map(site=>{
            let isSelected = site.urlName === currentSite.urlName;
            return {
              label: site.name,
              iconNode: isSelected ? <i className="fa fa-check"></i> : null,
              onClick: () => isSelected ? null : switchSite(site.urlName, tab)
            }
          }),{
            label: "Help",
            onClick: ()=> window.location = "https://github.com/bdwalker93/Tableau-Proxy/issues?utf8=%E2%9C%93&q=is%3Aissue"
          }]}
          renderRow={(row, index)=><ListItem key={index} onClick={row.onClick}>
            { row.iconNode ? row.iconNode : null }
            <div className='center'>{row.label}</div>
          </ListItem>}
        ></List>
      </Popover>

      {/*
      <DashboardHeader
        logout={logout}
        total={workbookIds.length}
        sites={sites}
        currentSite={currentSite}
        switchSite={switchSite}
        tab={tab}
        search={search}
        sortId={sortId}
        sortOptions={SORT_OPTIONS}
        orderId={orderId}
        orderOptions={ORDER_OPTIONS} />
        */}

      <div className="dashboard-content">
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          initialLoad={true}
          hasMore={hasMore}
          loader={<div className="loader">Loading ...</div>}
          useWindow={true}
          threshold={500}>
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


      <Tabbar
        index={this.state.tabIndex}
        onPreChange={(event) => {
          let tabName = tabList[event.index];
          //browserHistory.push('/app/workbooks/'+tabName);
        }}
        renderTabs={()=>[
        {
          content: <Stub/>,
          tab: <Tab label='Favorite' />
        },
        {
          content: <Stub/>,
          tab: <Tab label='Recent' />
        },
        {
          content: <Stub/>,
          tab: <Tab label='All' />
        }
      ]}/>
      
    </Page>
  }
});

function mapStateToProps(state) {
  return state.workbooks;
}

export const DashboardPage = connect(mapStateToProps, actionCreators)(Dashboard); 
