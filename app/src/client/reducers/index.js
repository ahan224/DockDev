import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import {
  REQUEST_CONFIG,
  RECEIVE_CONFIG,
  ADDING_PROJECT,
  ADDED_PROJECT,
  REQUEST_PROJECT,
  RECEIVE_PROJECT,
  ERROR_ADDING_PROJECT,
  ERROR_LOADING_PROJECT,
  ERROR_LOADING_CONFIG,
  ADDED_CONTAINER,
} from '../actions';

function config(state = { isFetching: false }, action) {
  switch (action.type) {
    case REQUEST_CONFIG:
      return { ...state, isFetching: true };
    case RECEIVE_CONFIG:
      return { ...state,
        isFetching: false,
        projects: action.projects,
        DOToken: action.DOToken,
      };
    default:
      return state;
  }
}

function alerts(state = [], action) {
  switch (action.type) {
    case ADDING_PROJECT:
    case REQUEST_PROJECT:
    case ERROR_ADDING_PROJECT:
    case ERROR_LOADING_PROJECT:
    case ERROR_LOADING_CONFIG:
      return [
        ...state,
        {
          message: action.message,
          time: action.time,
          timestamp: action.timestamp,
        },
      ];
    default:
      return state;
  }
}

function container(state = {}, action) {
  switch (action.type) {
    case ADDED_CONTAINER:
    default:
      return state;
  }
}

function containers(state = [], action) {
  switch (action.type) {
    case ADDED_CONTAINER:
      return [
        ...state,
        container({}, action),
      ];
    default:
      return state;
  }
}


function project(state = {}, action) {
  switch (action.type) {
    case ADDED_PROJECT:
    case RECEIVE_PROJECT:
      return { ...state,
        ...action.projObj,
        containers: containers(action.containers, action),
      };
    default:
      return state;
  }
}

function projects(state = {}, action) {
  switch (action.type) {
    case ADDED_PROJECT:
    case RECEIVE_PROJECT:
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
