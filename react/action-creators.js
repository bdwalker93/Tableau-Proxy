import axios from 'axios';

export function loadWorkbooks() {
  return function(dispatch) {
    axios({
      method: 'POST', 
      url: '/vizportal/api/web/v1/getWorkbooks',
      data:{"method":"getWorkbooks","params":{"order":[{"field":"hitsTotal","ascending":false},{"field":"name","ascending":true}],"page":{"startIndex":0,"maxItems":18},"statFields":["hitsTotal","favoritesTotal","hitsLastOneMonthTotal","hitsLastThreeMonthsTotal","hitsLastTwelveMonthsTotal","subscriptionsTotal"]}}
    }).then(res => {
      dispatch({
        type: 'SET_WORKBOOKS',
        workbooks: res.data.result.workbooks,
        favorites: res.data.result.favorites
      });

      res.data.result.workbooks.forEach((wb)=>{
        axios({
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
    });
  }
}

export function addFavoriteWorkbook(workbookId) {
  return function(dispatch) {
    axios({
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
    axios({
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

export function viewFavoriteWorkbooks() {
  console.log("getting in this");
  return function(dispatch) {
    axios({
      method: 'POST', 
      url: '/vizportal/api/web/v1/getWorkbooks',
      data:{"method":"getWorkbooks","params":{"filter":{"operator":"and","clauses":[{"operator":"eq","field":"isFavorite","value":true}]},"order":[{"field":"hitsTotal","ascending":false},{"field":"name","ascending":true}],"page":{"startIndex":0,"maxItems":18},"statFields":["hitsTotal","favoritesTotal","hitsLastOneMonthTotal","hitsLastThreeMonthsTotal","hitsLastTwelveMonthsTotal","subscriptionsTotal"]}}
    }).then(res => {
      console.log(res.data.result);
      dispatch({
        type: 'SET_WORKBOOKS',
        workbooks: res.data.result.workbooks,
        favorites: res.data.result.favorites
      });

      res.data.result.workbooks.forEach((wb)=>{
        axios({
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
    });
  }
}
