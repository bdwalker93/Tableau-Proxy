const uniq = require('lodash.uniq');

const init = {
  currentSite:{ urlName: '', name: '' },
  sites: [],
  workbookIds: [],
  workbooksById: {},
  hasMore: true,
  loadMore: function(){},
  loadingMore: false
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


const emptyViewsResult = { views:[], favorites:[] };
const emptyWorkbooksResult = { workbooks:[], favorites:[] };

function combineResult (wbRes=emptyWorkbooksResult, vRes=emptyViewsResult) {
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
    wb.workbookId = wb.id;
    map['workbook:'+id] = wb;
  })
  Object.keys(vObj.workbooksById).forEach(id=> {
    let wb = vObj.workbooksById[id];
    wb.defaultViewUrl = wb.path;
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
    case 'SET_CURRENT_SITE': {
      return { ...state, currentSite: action.currentSite }
    }
    case 'SET_SITES': {
      return { ...state, sites: action.sites }
    }
    case 'BUSY_LOADING_MORE': {
      return { ...state, loadingMore: true }
    }
    case 'LOAD_INITIAL_WORKBOOKS': {
      const {
        workbookIds,
        workbooksById,
        hasMore
      } = combineResult(action.workbooksResult, action.viewsResult);

      return {
        ...state,
        workbookIds,
        workbooksById,
        hasMore,
        loadMore: action.loadMore,
        loadingMore: false
      }
    }
    case 'LOAD_MORE_WORKBOOKS': {
      const {
        workbookIds,
        workbooksById,
        hasMore
      } = combineResult(action.workbooksResult, action.viewsResult);

      let newState = {
        ...state,
        workbookIds: uniq([...state.workbookIds, ...workbookIds]),
        workbooksById: {...state.workbooksById, ...workbooksById},
        loadMore: state.loadMore,
        hasMore,
        loadingMore: false
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
