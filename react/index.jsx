import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Redirect, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { reducer as formReducer } from 'redux-form'
import App from './components/App';
import { ServerSelectionPage } from './components/ServerSelectionPage';
import { DashboardPage } from './components/DashboardPage';
import { VizPage } from './components/VizPage';
import workbooksReducer from './reducers/workbooks';
import vizReducer from './reducers/viz';
import * as actionCreators from './action-creators';
import ReduxThunk from 'redux-thunk';

//import 'font-awesome/less/font-awesome.less';
import 'bootstrap/less/bootstrap.less';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';

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
        <Route path="/" component={ServerSelectionPage} />

        <Redirect from="/app" to="/app/workbooks" />

        <Redirect from="/app/workbooks" to="/app/workbooks/favorites" />

        <Redirect from="/app/workbooks/:tab" to="/app/workbooks/:tab/name/asc" />

        <Route path="/app/workbooks/:tab/:sortId/:orderId"
          component={DashboardPage}
          onEnter={({params: { tab, sortId, orderId }})=> {
            store.dispatch(actionCreators.loadTab(tab, sortId, orderId))
            store.dispatch(actionCreators.getSitesAndSetCurrent())
          }}
        />

        <Route path="/app/workbooks/:tab/:workbookId/views/:workbookName/:viewName"
          component={VizPage}
          onEnter={({params})=> store.dispatch(actionCreators.loadViz(params.workbookId, params.workbookName, params.viewName))}
        />

      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
