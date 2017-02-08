import request from './lib/request';

function getWorkbookRequest(method, options={}) {
  const defaultOrder = [
    { field:"hitsTotal", ascending:false },
    { field:"name", ascending:true }
  ];
  const defaultPage = { startIndex: 0, maxItems: 6 };
  return request({
    method: 'POST', 
    url: '/vizportal/api/web/v1/'+method,
    data:{
      "method":method,
      "params":{
        "filter": options.filter,
        "order": options.order || defaultOrder,
        "page": options.page || defaultPage,
        "statFields":[]
      }
    }
  })
}

function updateWorkbooks(workbooks=[]) {
  return function(dispatch) {
    workbooks.forEach((wb)=>{
      request({
        method: 'POST', 
        url: '/vizportal/api/web/v1/getWorkbook',
        data:{"method":"getWorkbook","params":{"id":wb.id}}
      }).then(res => {
        dispatch({
          type: 'UPDATE_WORKBOOK',
          id: wb.id,
          ownerName: res.data.result.owner.displayName,
          projectName: res.data.result.project.name
        });
      });
    })
  }
}

export function loadMoreWorkbooks(method, options={}) {
  return function(dispatch, getState) {
    getWorkbookRequest(method, {
      ...options,
      page: {
        startIndex: getState().workbooks.workbookIds.length,
        maxItems:6
      }
    }).then((res)=>{
      dispatch({ type: 'LOAD_MORE_WORKBOOKS', result: res.data.result });
      setTimeout(()=>dispatch(updateWorkbooks(res.data.result.workbooks)), 100);
    });
  }
}

export function loadAllWorkbooks() {
  return function(dispatch) {
    getWorkbookRequest("getWorkbooks").then((res)=>{
      dispatch({
        type: 'LOAD_INITIAL_WORKBOOKS',
        result: res.data.result,
        loadMore: ()=> dispatch(loadMoreWorkbooks("getWorkbooks"))
      });
      setTimeout(()=>dispatch(updateWorkbooks(res.data.result.workbooks)), 100);
    });
  }
}

export function loadFavoriteWorkbooks() {
  const options = {
    "filter": {
      "operator": "and",
      "clauses": [{
        "operator": "eq",
        "field": "isFavorite",
        "value": true
      }]
    }
  }
  return function(dispatch) {
    Promise.all([
      getWorkbookRequest("getWorkbooks", options),
      getWorkbookRequest("getViews", options)
    ]).then(([wbRes, vRes]) => {
      dispatch({
        type: 'LOAD_INITIAL_WORKBOOKS',
        workbooksResult: wbRes.data.result,
        viewsResult: vRes.data.result,
        loadMore: ()=> {}//dispatch(loadMoreWorkbooks("getViews", options))
      });
    })
    //  .then((res)=>{
    //  dispatch({
    //    type: 'LOAD_INITIAL_WORKBOOKS',
    //    result: res.data.result,
    //    loadMore: ()=> dispatch(loadMoreWorkbooks("getViews", options))
    //  });
    //  setTimeout(()=>dispatch(updateWorkbooks(res.data.result.workbooks)), 100);
    //});
  }
}

export function loadRecentWorkbooks() {
  const options = {
    "filter": {
      "operator": "and",
      "clauses": [{
        "operator": "eq",
        "field": "isRecent",
        "value": true
      }]
    }
  }
  return function(dispatch) {
    getWorkbookRequest(options).then((res)=>{
      dispatch({
        type: 'LOAD_INITIAL_WORKBOOKS',
        result: res.data.result,
        loadMore: ()=> dispatch(loadMoreWorkbooks(options))
      });
      setTimeout(()=>dispatch(updateWorkbooks(res.data.result.workbooks)), 100);
    });
  }
}

export function addFavoriteWorkbook(workbookId) {
  return function(dispatch) {
    request({
      method: 'POST', 
      url: "/vizportal/api/web/v1/addFavorite",
      data:{"method":"addFavorite","params":{"objectId":workbookId,"objectType":"workbook"}}
    }).then(res => {
      dispatch({
        type: 'UPDATE_WORKBOOK_FAV',
        id: workbookId,
        isFavorite: true,
      });
    });
  }
}

export function deleteFavoriteWorkbook(workbookId) {
  return function(dispatch) {
    request({
      method: 'POST', 
      url: "/vizportal/api/web/v1/removeFavorite",
      data:{"method":"removeFavorite","params":{"objectId":workbookId,"objectType":"workbook"}}
    }).then(res => {
      dispatch({
        type: 'UPDATE_WORKBOOK_FAV',
        id: workbookId,
        isFavorite: false,
      });
    });
  }
}

export function logout() {
  return function(dispatch) {
    request({
      method: 'POST', 
      url: "/vizportal/api/web/v1/logout",
      data:{"method":"logout","params":{}}
    }).then(res => {
      window.location = '/'
    });
  }
}

export function loadViz(workbookId, workbookName, viewName) {
  return function(dispatch) {
    request({
      method: 'POST',
      url: '/vizportal/api/web/v1/getSessionInfo',
      data: {"method":"getSessionInfo","params":{}}
    }).then((res) => {
      let siteName = res.data.result.site.urlName;
      request({
        method: 'POST',
        url: '/vizportal/api/web/v1/getViews',
        data: {
          "method": "getViews",
          "params": {
            "filter": {
              "operator": "and",
              "clauses": [{
                "operator": "eq",
                "field": "workbookId",
                "value": workbookId
              }]
            },
            "order": [{
              "field": "index",
              "ascending": true
            }],
            "page": {
              "startIndex": 0,
              "maxItems": 24
            },
            "statFields": ["hitsTotal", "hitsLastOneMonthTotal", "hitsLastThreeMonthsTotal", "hitsLastTwelveMonthsTotal", "favoritesTotal"]
          }
        }
      }).then((res)=>{
        dispatch({
          type: 'SET_VIZ',
          site: siteName,
          views: res.data.result.views,
          viewPath: workbookName+'/'+viewName
        })

        request({
          method: 'POST',
          url: '/vizportal/api/web/v1/markRecentlyViewed',
          data: {
            "method":"markRecentlyViewed",
            "params":{"objectId":workbookId,"objectType":"workbook"}
          }
        });
      });
    });
  }
}
