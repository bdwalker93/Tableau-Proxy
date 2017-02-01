import request from './lib/request';

function getAndDispatchWorkbooks(data) {
  return function(dispatch) {
    request({
      method: 'POST', 
      url: '/vizportal/api/web/v1/getWorkbooks',
      data
    }).then(res => {
      dispatch({
        type: 'SET_WORKBOOKS',
        workbooks: res.data.result.workbooks,
        favorites: res.data.result.favorites
      });

      setTimeout(function() {
        res.data.result.workbooks.forEach((wb)=>{
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
      }, 100)
    });
  }
}

export function loadAllWorkbooks() {
  return getAndDispatchWorkbooks({
    "method":"getWorkbooks",
    "params":{
      "order":[{
        "field":"hitsTotal",
        "ascending":false
      },{
        "field":"name",
        "ascending":true
      }],
      "page":{
        "startIndex":0,
        "maxItems":999
      },
      "statFields":[
        "hitsTotal",
        "favoritesTotal",
        "hitsLastOneMonthTotal",
        "hitsLastThreeMonthsTotal",
        "hitsLastTwelveMonthsTotal",
        "subscriptionsTotal"
      ]
    }
  })
}

export function loadFavoriteWorkbooks() {
  return getAndDispatchWorkbooks({
    "method": "getWorkbooks",
    "params": {
      "filter": {
        "operator": "and",
        "clauses": [{
          "operator": "eq",
          "field": "isFavorite",
          "value": true
        }]
      },
      "order": [{
        "field": "hitsTotal",
        "ascending": false
      }, {
        "field": "name",
        "ascending": true
      }],
      "page": {
        "startIndex": 0,
        "maxItems": 18
      },
      "statFields": [
        "hitsTotal",
        "favoritesTotal",
        "hitsLastOneMonthTotal",
        "hitsLastThreeMonthsTotal",
        "hitsLastTwelveMonthsTotal",
        "subscriptionsTotal"
      ]
    }
  });
}

export function loadRecentWorkbooks() {
  return getAndDispatchWorkbooks({
    "method": "getWorkbooks",
    "params": {
      "filter": {
        "operator": "and",
        "clauses": [{
          "operator": "eq",
          "field": "isRecent",
          "value": true
        }]
      },
      "order": [{
        "field": "hitsTotal",
        "ascending": false
      }, {
        "field": "name",
        "ascending": true
      }],
      "page": {
        "startIndex": 0,
        "maxItems": 18
      },
      "statFields": [
        "hitsTotal",
        "favoritesTotal",
        "hitsLastOneMonthTotal",
        "hitsLastThreeMonthsTotal",
        "hitsLastTwelveMonthsTotal",
        "subscriptionsTotal"
      ]
    }
  });
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
      });
    });
  }
}
