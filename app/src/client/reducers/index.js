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
  LOAD_IMAGES,
  TOGGLE_SELECT_IMAGE,
  SETTING_UP_CONTAINER,
  ADDED_CONTAINER,
  ERROR_PULLING_IMAGE,
  PULLING_IMAGE,
  ERROR_CREATING_CONTAINER,
  PULLED_IMAGE,

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
    case SETTING_UP_CONTAINER:
    case PULLING_IMAGE:
    case ERROR_ADDING_PROJECT:
    case ERROR_LOADING_PROJECT:
    case ERROR_LOADING_CONFIG:
    case ERROR_PULLING_IMAGE:
    case ERROR_CREATING_CONTAINER:
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
    case PULLED_IMAGE:
      return {
        ...action.containerObj,
      };
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
    case PULLED_IMAGE:
      return [
        ...state.slice(0, action.idx),
        container({}, action),
        ...state.slice(action.idx + 1),
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
      };
    case ADDED_CONTAINER:
    case PULLED_IMAGE:
      return {
        ...state,
        containers: containers(state.containers, action),
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
        [action.projObj.cleanName]: project(state[action.projObj.cleanName], action),
      };
    case ADDED_CONTAINER:
    case PULLED_IMAGE:
      return { ...state,
        [action.containerObj.cleanName]: project(state[action.containerObj.cleanName], action),
      };
    default:
      return state;
  }
}

function availableImages(state = [], action) {
  switch (action.type) {
    case LOAD_IMAGES:
      return [
        ...action.images,
      ];
    case TOGGLE_SELECT_IMAGE:
      return [
        ...state.slice(0, action.idx),
        action.image,
        ...state.slice(action.idx + 1),
      ];
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  config,
  routing,
  projects,
  alerts,
  availableImages,
});

export default rootReducer;
