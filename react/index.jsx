import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { reducer as formReducer } from 'redux-form'
import App from './components/App';
import { WorkbooksPage } from './components/WorkbooksPage';
import workbooksReducer from './reducers/workbooks';
import * as actionCreators from './action-creators';

import 'font-awesome/less/font-awesome.less';
import 'bootstrap/less/bootstrap.less';

import axios from 'axios';

const reducer = combineReducers({
  form: formReducer,
  workbooks: workbooksReducer
});

const store = createStore(reducer);

function loadWorkbooks() {
  axios({
    method: 'POST', 
    url: '/vizportal/api/web/v1/getWorkbooks',
    data:{"method":"getWorkbooks","params":{"order":[{"field":"hitsTotal","ascending":false},{"field":"name","ascending":true}],"page":{"startIndex":0,"maxItems":18},"statFields":["hitsTotal","favoritesTotal","hitsLastOneMonthTotal","hitsLastThreeMonthsTotal","hitsLastTwelveMonthsTotal","subscriptionsTotal"]}}
  }).then(res => {
    console.log('GOT RESPONSE LOL', res.data);
    store.dispatch({
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
        store.dispatch({
          type: 'UPDATE_WORKBOOK',
          id: wb.id,
          ownerName: res.data.result.owner.displayName,
          projectName: res.data.result.project.name
        });
      });
    })


  });
}

// Mostly boilerplate, except for the Routes. These are the pages you can go to,
// which are all wrapped in the App component, which contains the navigation etc
ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route component={App}>
        <Route path="/" component={WorkbooksPage} onEnter={loadWorkbooks} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
