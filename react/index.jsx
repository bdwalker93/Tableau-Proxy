import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Redirect, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { reducer as formReducer } from 'redux-form'
import App from './components/App';
import { DashboardPage } from './components/DashboardPage';
import { VizPage } from './components/VizPage';
import workbooksReducer from './reducers/workbooks';
import vizReducer from './reducers/viz';
import * as actionCreators from './action-creators';
import ReduxThunk from 'redux-thunk';

import 'font-awesome/less/font-awesome.less';
import 'bootstrap/less/bootstrap.less';

const reducer = combineReducers({
  form: formReducer,
  workbooks: workbooksReducer,
  viz: vizReducer
});

const store = createStore(reducer, applyMiddleware(ReduxThunk));

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route component={App}>
        <Redirect from="/app/" to="/app/workbooks/favorites" />

        <Route path="/app/workbooks/all"
          component={DashboardPage}
          onEnter={()=> store.dispatch(actionCreators.loadAllWorkbooks()) }
        />

        <Route path="/app/workbooks/favorites"
          component={DashboardPage}
          onEnter={()=> store.dispatch(actionCreators.loadFavoriteWorkbooks()) }
        />

        <Route path="/app/workbooks/recent"
          component={DashboardPage}
          onEnter={()=> store.dispatch(actionCreators.loadRecentWorkbooks()) }
        />

        <Route path="/app/workbooks/:workbookId/views/:workbookName/:viewName"
          component={VizPage}
          onEnter={({params})=> store.dispatch(actionCreators.loadViz(params.workbookId, params.workbookName, params.viewName))} />

      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
