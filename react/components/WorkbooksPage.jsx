import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import { WorkbookListItem } from './WorkbookListItem';

import './WorkbooksPage.less';

const Workbooks = ({
  workbooksById,
  workbookIds,
  addFavoriteWorkbook,
  deleteFavoriteWorkbook
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
  />)}
</div>

function mapStateToProps(state) {
  // console.log(state.workbooks);
  return state.workbooks
}

export const WorkbooksPage = connect(mapStateToProps, actionCreators)(Workbooks);
