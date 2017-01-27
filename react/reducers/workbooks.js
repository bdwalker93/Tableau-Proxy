const init = {
  workbookIds: [],
  workbooksById: {},
}

export default function(state = init, action) {
  switch (action.type) {
    case 'SET_WORKBOOKS': {
      return action.workbooks.reduce((memo, wb) => {
        let obj = {...memo.workbooksById};

        // wb needs to have an isFavorite flag. determine this
        wb.isFavorite = false;
        if ( action.favorites ) {
          wb.isFavorite = action.favorites.reduce((memo, favId) => {
            if ( memo ) return memo;
            if ( favId === wb.id ) return true;
          }, wb.isFavorite);
        }

        obj[wb.id] = wb;
        return {
          workbookIds: [...memo.workbookIds, wb.id],
          workbooksById: obj
        }
      }, init);      
    }
    case 'UPDATE_WORKBOOK': {
      let obj = {...state.workbooksById};
      let wb = obj[action.id];
      wb.ownerName = action.ownerName;
      wb.projectName = action.projectName;
      return {
        workbookIds: state.workbookIds,
        workbooksById: obj
      }
    }
    case 'UPDATE_WORKBOOK_FAV': {
      let obj = {...state.workbooksById};
      let wb = obj[action.id];
      wb.isFavorite = action.isFavorite;
      return {
        workbookIds: state.workbookIds,
        workbooksById: obj
      }
    }
  }
  return state
}
