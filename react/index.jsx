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

//import 'font-awesome/less/font-awesome.less';
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

        <Route path="/app/workbooks/:tab"
          component={DashboardPage}
          onEnter={({params: { tab }})=> {
            if (tab === "all") {
              store.dispatch(actionCreators.loadAllWorkbooks())
            } else if (tab==="recent") {
              store.dispatch(actionCreators.loadRecentWorkbooks())
            } else if (tab === "favorites") {
              store.dispatch(actionCreators.loadFavoriteWorkbooks())
            }
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
