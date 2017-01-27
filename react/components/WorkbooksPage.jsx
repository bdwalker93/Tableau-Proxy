import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import { WorkbookListItem } from './WorkbookListItem';
import { WorkbookFooter } from './WorkbookFooter';

import './WorkbooksPage.less';

const Workbooks = ({
  workbooksById,
  workbookIds,
  addFavoriteWorkbook,
  deleteFavoriteWorkbook,
  viewFavoriteWorkbooks,
  tst
}) =>
  <div className="workbook-page">
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
    <WorkbookFooter
      viewAllWbs={() => {
        console.log("view all");
      }}
      viewRecentWbs={() => {
        console.log("view recent");
      }}
      viewFavoriteWbs={() => {
        console.log("view favorites");
        viewFavoriteWorkbooks();
      }}
    />

  </div>

function mapStateToProps(state) {
  // console.log(state.workbooks);
  return state.workbooks
}

export const WorkbooksPage = connect(mapStateToProps, actionCreators)(Workbooks);
