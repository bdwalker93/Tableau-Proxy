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

const reducer = combineReducers({
  form: formReducer,
  workbooks: workbooksReducer
});

const remoteActionMiddleware = store => next => action => {
  if (action.meta && action.meta.remote) {
    console.log("TODO emit action over ajax");
    console.log(action);
    // request response cycle
    // // response....
    //  socket.on('action', action => {
    //    console.log('incoming socket event. dispatching', action);
    //    store.dispatch(action);
    //  })
  }
  next(action);
}

const createStoreWithMiddleware = applyMiddleware(
  remoteActionMiddleware
)(createStore);

const store = createStoreWithMiddleware(reducer);

function loadWorkbooks() {
  //socket.emit('action', actionCreators.loadWorkbooks())
  store.dispatch(actionCreators.loadWorkbooks());
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
