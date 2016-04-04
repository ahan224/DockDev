import { defaultConfig, appConfig } from './server/main';

export const REQUEST_CONFIG = 'REQUEST_CONFIG';
export const RECEIVE_CONFIG = 'RECEIVE_CONFIG';
export const REQUEST_PROJECT = 'REQUEST_PROJECT';
export const RECEIVE_PROJECT = 'RECEIVE_PROJECT';
export const ADDED_PROJECT = 'ADD_PROJECT';

function requestConfig() {
  return {
    type: REQUEST_CONFIG,
    isFetching: true,
  };
}

function receiveConfig(config) {
  return {
    type: RECEIVE_CONFIG,
    projects: config.projects,
    tokens: config.tokes,
  };
}

function requestProject(path) {
  return {
    type: REQUEST_PROJECT,
    path,
  };
}

function receiveProject(projObj) {
  return {
    type: RECEIVE_PROJECT,
    projObj,
  };
}

function addedProject(projObj) {
  return {
    type: ADDED_PROJECT,
    projObj,
  };
}


export function loadConfig() {
  return dispatch => {
    dispatch(requestConfig());
    return appConfig.loadConfigFile(defaultConfig)
      .then(response => dispatch(receiveConfig(response)));
  };
}

export function addProject(name, path) {
  return dispatch => {
    return 
  }
}

// export function loadProject(path) {
//   return dispatch => {
//
//   }
// }
