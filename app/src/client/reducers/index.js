import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import { REQUEST_CONFIG, RECEIVE_CONFIG } from '../actions';

function config(state = { isFetching: false }, action) {
  switch (action.type) {
    case REQUEST_CONFIG:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case RECEIVE_CONFIG:
      return Object.assign({}, state, {
        isFetching: false,
        projects: action.config.projects,
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  config,
  routing,
});

export default rootReducer;
