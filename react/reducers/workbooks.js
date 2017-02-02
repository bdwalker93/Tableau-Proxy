const uniq = require('lodash.uniq');

const init = {
  workbookIds: [],
  workbooksById: {},
  hasMore: true,
  loadMore: function(){},
}

const reduceWorkbooks = (workbooks, favorites) => {
  return workbooks.reduce((memo, wb) => {
    let obj = {...memo.workbooksById};

    // wb needs to have an isFavorite flag. determine this
    wb.isFavorite = false;
    if ( favorites ) {
      wb.isFavorite = favorites.reduce((memo, favId) => {
        if ( memo ) return memo;
        if ( favId === wb.id ) return true;
      }, wb.isFavorite);
    }

    obj[wb.id] = wb;
    return {
      workbookIds: [...memo.workbookIds, wb.id],
      workbooksById: obj,
    }
  }, init);      
}

export default function(state = init, action) {
  switch (action.type) {
    case 'LOAD_INITIAL_WORKBOOKS': {
      const {
        workbookIds,
        workbooksById
      } = reduceWorkbooks(action.result.workbooks, action.result.favorites);
      return {
        workbookIds,
        workbooksById,
        hasMore: action.result.moreItems,
        loadMore: action.loadMore
      }
    }
    case 'LOAD_MORE_WORKBOOKS': {
      console.log('!!!', action.result);
      const {
        workbookIds,
        workbooksById
      } = reduceWorkbooks(action.result.workbooks, action.result.favorites);
      console.log('???', workbookIds, workbooksById);
      let newState =  {
        workbookIds: uniq([...state.workbookIds, ...workbookIds]),
        workbooksById: {...state.workbooksById, ...workbooksById},
        hasMore: action.result.moreItems,
        loadMore: state.loadMore
      }
      console.log(newState);
      return newState
    }
    case 'UPDATE_WORKBOOK': {
      let obj = {...state.workbooksById};
      let wb = obj[action.id];
      if (!wb) return state;
      wb.ownerName = action.ownerName;
      wb.projectName = action.projectName;
      return {
        ...state,
        workbookIds: state.workbookIds,
        workbooksById: obj,
      }
    }
    case 'UPDATE_WORKBOOK_FAV': {
      let obj = {...state.workbooksById};
      let wb = obj[action.id];
      if (!wb) return state;
      wb.isFavorite = action.isFavorite;
      return {
        ...state,
        workbookIds: state.workbookIds,
        workbooksById: obj
      }
    }
  }
  return state
}
