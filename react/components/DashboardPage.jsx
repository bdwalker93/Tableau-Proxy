import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import { WorkbookListItem } from './WorkbookListItem';
import { DashboardFooter } from './DashboardFooter';
import { DashboardHeader } from './DashboardHeader';

import './DashboardPage.less';

const Dashboard = ({
  workbooksById,
  workbookIds,
  addFavoriteWorkbook,
  deleteFavoriteWorkbook,
  loadDashboard,
  viewFavoriteDashboard,
  viewRecentDashboard,
  logout
}) =>
  <div className="dashboard-page">

    <DashboardHeader logout={logout} />

    <div className="dashboard-content">
      { workbookIds.map(id => <WorkbookListItem key={id}
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
    </div>
    
    <DashboardFooter
      viewAllWbs={loadDashboard}
      viewRecentWbs={viewRecentDashboard}
      viewFavoriteWbs={viewFavoriteDashboard}
    />

  </div>

function mapStateToProps(state) {
  // console.log(state.workbooks);
  return state.workbooks
}

export const DashboardPage = connect(mapStateToProps, actionCreators)(Dashboard);
