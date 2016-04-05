import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import {
  REQUEST_CONFIG,
  RECEIVE_CONFIG,
  ADDING_PROJECT,
  ADDED_PROJECT,
  ERROR_ADDING_PROJECT,
} from '../actions';

function config(state = { isFetching: false }, action) {
  switch (action.type) {
    case REQUEST_CONFIG:
      return { ...state, isFetching: true };
    case RECEIVE_CONFIG:
      return { ...state,
        isFetching: false,
        projects: action.projects,
        tokens: action.tokens,
      };
    default:
      return state;
  }
}

function alerts(state = [], action) {
  switch (action.type) {
    case ADDING_PROJECT:
      return [
        ...state,
        {
          message: action.message,
          timestamp: action.timestamp,
        },
      ];
    case ERROR_ADDING_PROJECT:
      return [
        ...state,
        {
          message: action.message,
          timestamp: action.timestamp,
        },
      ];
    default:
      return state;
  }
}

function project(state = { isFetching: false }, action) {
  switch (action.type) {
    case ADDED_PROJECT:
      return { ...state,
        ...action.projObj,
      };
    default:
      return state;
  }
}

function projects(state = {}, action) {
  switch (action.type) {
    case ADDED_PROJECT:
      return { ...state,
        [action.projObj.cleanName]: project(state[action.cleanName], action),
      };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  config,
  routing,
  projects,
  alerts,
});

export default rootReducer;
