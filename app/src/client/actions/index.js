import { defaultConfig, appConfig } from './server/main';

export const REQUEST_CONFIG = 'REQUEST_CONFIG';
export const RECEIVE_CONFIG = 'RECEIVE_CONFIG';
// export const REQUEST_PROJECT = 'REQUEST_PROJECT';
// export const RECEIVE_PROJECT = 'RECEIVE_PROJECT';

function requestConfig() {
  return {
    type: REQUEST_CONFIG,
    isFetching: true,
  };
}

function receiveConfig(config) {
  return {
    type: RECEIVE_CONFIG,
    config,
  };
}

export function loadConfig() {
  return dispatch => {
    dispatch(requestConfig());
    return appConfig.loadConfigFile(defaultConfig)
      .then(response => dispatch(receiveConfig(response)));
  };
}
