const uniq = require('lodash.uniq');

const init = {
  workbookIds: [],
  workbooksById: {},
  hasMore: true,
  loadMore: function(){},
}

const reduceWorkbooks = (workbooks=[], favorites=[]) => {
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


const emptyViewResult = { views:[], favorites:[] };

function combineResult (wbRes, vRes=emptyViewResult) {
  let wbObj = reduceWorkbooks(wbRes.workbooks, wbRes.favorites);
  let vObj = reduceWorkbooks(vRes.views, vRes.favorites);
  let list = [];
  let map = {};
  wbObj.workbookIds.forEach(id=> {
    list.push('workbook:'+id);
  })
  vObj.workbookIds.forEach(id=> {
    list.push('view:'+id);
  })
  Object.keys(wbObj.workbooksById).forEach(id=> {
    let wb = wbObj.workbooksById[id];
    wb.isWorkbook = true;
    map['workbook:'+id] = wb;
  })
  Object.keys(vObj.workbooksById).forEach(id=> {
    let wb = vObj.workbooksById[id];
    wb.isWorkbook = false;
    map['view:'+id] = wb;
  })

  return {
    workbookIds: list,
    workbooksById: map,
    hasMore: wbRes.moreItems || vRes.moreItems
  }
}

export default function(state = init, action) {
  switch (action.type) {
    case 'LOAD_INITIAL_WORKBOOKS': {
      const {
        workbookIds,
        workbooksById,
        hasMore
      } = combineResult(action.workbooksResult, action.viewsResult);

      console.log(workbookIds, workbooksById);
      return {
        workbookIds,
        workbooksById,
        hasMore,
        loadMore: action.loadMore
      }
    }
    case 'LOAD_MORE_WORKBOOKS': {
      const {
        workbookIds,
        workbooksById,
        hasMore
      } = combineResult(action.workbooksResult, action.viewsResult);

      let newState = {
        workbookIds: uniq([...state.workbookIds, ...workbookIds]),
        workbooksById: {...state.workbooksById, ...workbooksById},
        loadMore: state.loadMore,
        hasMore,
      }

      return newState
    }
    case 'UPDATE_WORKBOOK': {
      let obj = {...state.workbooksById};
      let wb = obj[action.key];
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
