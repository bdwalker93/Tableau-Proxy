import request from './lib/request';
import { addSort } from './sorting';

let isSearching = false;
let searchQuery = '';

function getWorkbookRequest(method, options={}) {
  const defaultPage = { startIndex: 0, maxItems: 100 };
  return request({
    method: 'POST', 
    url: '/vizportal/api/web/v1/'+method,
    data:{
      "method":method,
      "params":{
        "filter": options.filter,
        "order": addSort(options.sortId, options.orderId),
        "page": options.page || defaultPage,
        "statFields":[]
      }
    }
  })
}

function updateWorkbooks() {
  return function(dispatch, getState) {
    const state = getState().workbooks;
    state.workbookIds.forEach(key=>{
      const {
        id,
        workbookId,
        isWorkbook,
        ownerName,
        projectName,
      } = state.workbooksById[key];

      if (ownerName && projectName) return;

      request({
        method: 'POST', 
        url: '/vizportal/api/web/v1/getWorkbook',
        data:{"method":"getWorkbook","params":{
          "id": isWorkbook ? id : workbookId
        }}
      }).then(res => {
        dispatch({
          type: 'UPDATE_WORKBOOK',
          key,
          ownerName: res.data.result.owner.displayName,
          projectName: res.data.result.project.name
        });
      });
    })
  }
}

function countMapItemsOnCondition(items, condition) {
  return Object.keys(items).reduce((acc, key) => {
    return condition(items[key]) ? acc+1 : acc;
  }, 0);
}

export function loadMoreWorkbooks(options={}, shouldGetViews=false) {
  return function(dispatch, getState) {
    const busy = getState().workbooks.loadingMore;
    if (busy) return false;

    dispatch({type:"BUSY_LOADING_MORE"});

    let map = getState().workbooks.workbooksById;
    let wbCount = countMapItemsOnCondition(map, i => i.isWorkbook);
    let maxItems = 100;

    let promises = [];
    promises.push(
      getWorkbookRequest("getWorkbooks", {
        ...options,
        page: {
          startIndex: wbCount,
          maxItems
        }
      })
    )

    if (shouldGetViews) {
      let vCount = countMapItemsOnCondition(map, i => !i.isWorkbook);
      promises.push(
        getWorkbookRequest("getViews", {
          ...options,
          page: {
            startIndex: vCount,
            maxItems
          }
        })
      )
    }
      
    Promise.all(promises).then(([wbRes, vRes])=>{
      dispatch({
        type: 'LOAD_MORE_WORKBOOKS',
        workbooksResult: wbRes.data.result,
        viewsResult: shouldGetViews ? vRes.data.result : undefined,
        sortId: options.sortId,
        orderId: options.orderId
      });
      setTimeout(()=>dispatch(updateWorkbooks()), 100);
    });
  }
}

function loadWorkbooks (options={}, shouldGetViews=false) {
  return function(dispatch, getState) {
    Promise.all([
      getWorkbookRequest("getWorkbooks", options),
      shouldGetViews ? getWorkbookRequest("getViews", options) : undefined
    ]).then(([wbRes, vRes]) => {
      dispatch({
        type: 'LOAD_INITIAL_WORKBOOKS',
        workbooksResult: wbRes.data.result,
        viewsResult: shouldGetViews ? vRes.data.result : undefined,
        loadMore: () => dispatch(loadMoreWorkbooks(options, shouldGetViews)),
        sortId: options.sortId,
        orderId: options.orderId
      });
      setTimeout(()=>dispatch(updateWorkbooks()), 100);
    });
  }
}

export function addFavoriteWorkbook(key) {
  return function(dispatch, getState) {
    const { id } = getState().workbooks.workbooksById[key];
    dispatch({ type: 'UPDATE_WORKBOOK_FAV', id: key, isFavorite: true });
    request({
      method: 'POST', 
      url: "/vizportal/api/web/v1/addFavorite",
      data:{
        "method":"addFavorite",
        "params":{ "objectId": id, "objectType": 'workbook' }
      }
    }).catch(()=> dispatch({ type: 'UPDATE_WORKBOOK_FAV', id: key, isFavorite: false }));
  }
}

export function deleteFavoriteWorkbook(key) {
  return function(dispatch, getState) {
    const { id } = getState().workbooks.workbooksById[key];
    dispatch({ type: 'UPDATE_WORKBOOK_FAV', id: key, isFavorite: false });
    request({
      method: 'POST', 
      url: "/vizportal/api/web/v1/removeFavorite",
      data:{
        "method":"removeFavorite",
        "params":{ "objectId": id, "objectType": 'workbook' }
      }
    }).catch(()=> dispatch({ type: 'UPDATE_WORKBOOK_FAV', id: key, isFavorite: true }));
  }
}

export function addFavoriteView(id) {
  let jid = 'view:'+id;
  return function(dispatch, getState) {
    dispatch({ type: 'UPDATE_VIZ_FAV', id, isFavorite: true });
    dispatch({ type: 'UPDATE_WORKBOOK_FAV', id: jid, isFavorite: true });
    request({
      method: 'POST', 
      url: "/vizportal/api/web/v1/addFavorite",
      data:{
        "method":"addFavorite",
        "params":{ "objectId": id, "objectType": 'view' }
      }
    }).catch(()=> {
      dispatch({ type: 'UPDATE_VIZ_FAV', id, isFavorite: false })
      dispatch({ type: 'UPDATE_WORKBOOK_FAV', id: jid, isFavorite: false });
    });
  }
}

export function deleteFavoriteView(id) {
  let jid = 'view:'+id;
  return function(dispatch, getState) {
    dispatch({ type: 'UPDATE_VIZ_FAV', id, isFavorite: false });
    dispatch({ type: 'UPDATE_WORKBOOK_FAV', id: jid, isFavorite: false });
    request({
      method: 'POST', 
      url: "/vizportal/api/web/v1/removeFavorite",
      data:{
        "method":"removeFavorite",
        "params":{ "objectId": id, "objectType": 'view' }
      }
    }).catch(()=> {
      dispatch({ type: 'UPDATE_VIZ_FAV', id, isFavorite: true })
      dispatch({ type: 'UPDATE_WORKBOOK_FAV', id: jid, isFavorite: true });
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
              "maxItems": 100
            },
            "statFields": ["hitsTotal", "hitsLastOneMonthTotal", "hitsLastThreeMonthsTotal", "hitsLastTwelveMonthsTotal", "favoritesTotal"]
          }
        }
      }).then((res)=>{
        dispatch({
          type: 'SET_VIZ',
          site: siteName,
          viewsResult: res.data.result,
          viewPath: workbookName+'/'+viewName,
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

export function getSitesAndSetCurrent() {
  return function(dispatch) {
    request({
      method: 'POST',
      url: '/vizportal/api/web/v1/getSessionInfo',
      data: {"method":"getSessionInfo","params":{}}
    }).then((res) => {

      dispatch({
        type: 'SET_CURRENT_USER',
        currentUser: res.data.result.user
      })

      let site = res.data.result.site;

      request({
        method: 'POST',
        url: '/vizportal/api/web/v1/getSiteNamesAcrossAllPods',
        data: {
          "method":"getSiteNamesAcrossAllPods",
          "params":{"page":{"startIndex":0,"maxItems":1000}}
        }
      }).then((res) => {
        dispatch({
          type: 'SET_SITES',
          sites: res.data.result.siteNames,
        })

        dispatch({
          type: 'SET_CURRENT_SITE',
          currentSite: site,
        })
      });
    });
  }
}

export function switchSite(urlName, tab) {
  return function(dispatch, getState) {
    request({
      method: 'POST',
      url: '/vizportal/api/web/v1/switchSite',
      data: {method: "switchSite", params:{urlName}}
    }).then((res) => {
      dispatch({
        type: 'SET_CURRENT_SITE',
        currentSite: {
          name: res.data.result.site.name,
          urlName: res.data.result.site.urlName
        }
      })
      dispatch(loadTab(tab))
    });
  }
}

function tabOptions(tab) {
  if (tab === "all") {
    return { clauses: [], views: true };
  } else if (tab === "recent") {
    return {
      clauses: [{
        "operator": "eq",
        "field": "isRecent",
        "value": true
      }],
      views: true
    }
  } else if (tab === "favorites") {
    return {
      clauses: [{
        "operator": "eq",
        "field": "isFavorite",
        "value": true
      }],
      views: true
    }
  }
}

export function loadTab(tab, sortId, orderId) {
  const { clauses, views } = tabOptions(tab);
  if (isSearching) {
    return search(searchQuery, tab, sortId, orderId);
  } else {
    return loadWorkbooks({
      filter: { operator: "and", clauses },
      sortId,
      orderId
    }, views);
  }
}

export function search(query, tab, sortId, orderId) {
  searchQuery = query;
  if (query || query.length > 0) {
    isSearching = true;
    const { clauses, views } = tabOptions(tab);
    return loadWorkbooks({
      filter: {
        operator: "and",
        clauses: [...clauses, {
          operator: "matches",
          value: query
        }]
      },
      sortId,
      orderId
    }, views);
  } else {
    isSearching = false;
    return loadTab(tab, sortId, orderId);
  }
}

export function connectToTableau(key) {
  return function(dispatch, getState) {
    request({
      method: 'POST', 
      url: "/vizportal/api/web/v1/getServerSettingsUnauthenticated",
      data:{
        "method":"getServerSettingsUnauthenticated",
        "params":{ }
      }
    }).then(() =>{
      window.location = "/signin";
    }).catch(() => {
      alert("Tablea Server Not Found");
    })
  }
}
