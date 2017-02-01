import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
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

function loadWorkbooks() {
  store.dispatch(actionCreators.loadWorkbooks());
}

function loadDefaultView({params:{id}}) {
  store.dispatch(actionCreators.loadDefaultView(id));
}

// Mostly boilerplate, except for the Routes. These are the pages you can go to,
// which are all wrapped in the App component, which contains the navigation etc
ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route component={App}>
        <Route path="/app/" component={DashboardPage} onEnter={loadWorkbooks} />
        <Route path="/app/viz/:id" component={VizPage} onEnter={loadDefaultView} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
