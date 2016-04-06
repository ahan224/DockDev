import { push } from 'react-router-redux';
import moment from 'moment';
import {
  defaultConfig,
  appConfig,
  projConfig,
  availableImages,
} from './server/main';

export const REQUEST_CONFIG = 'REQUEST_CONFIG';
export const RECEIVE_CONFIG = 'RECEIVE_CONFIG';
export const REQUEST_PROJECT = 'REQUEST_PROJECT';
export const RECEIVE_PROJECT = 'RECEIVE_PROJECT';
export const ADDING_PROJECT = 'ADDING_PROJECT';
export const ADDED_PROJECT = 'ADDED_PROJECT';
export const ERROR_ADDING_PROJECT = 'ERROR_ADDING_PROJECT';
export const ERROR_LOADING_CONFIG = 'ERROR_LOADING_CONFIG';
export const ERROR_LOADING_PROJECT = 'ERROR_LOADING_PROJECT';
export const ADDED_CONTAINER = 'ADDED_CONTAINER';
export const LOAD_IMAGES = 'LOAD_IMAGES';
export const TOGGLE_SELECT_IMAGE = 'TOGGLE_SELECT_IMAGE';

function requestConfig() {
  return {
    type: REQUEST_CONFIG,
    isFetching: true,
  };
}

function receiveConfig(config) {
  return {
    type: RECEIVE_CONFIG,
    isFetching: false,
    projects: config.projects,
    DOToken: config.DOToken,
  };
}

function requestProject(project) {
  return {
    type: REQUEST_PROJECT,
    message: `Trying to load ${project.projectName} @ ${project.basePath}`,
    time: moment(),
    timestamp: moment().format('MM-D-YYYY, h:mm:ss a'),
  };
}

function receiveProject(projObj) {
  return {
    type: RECEIVE_PROJECT,
    projObj,
  };
}

function loadProjectError(err, project) {
  return {
    type: ERROR_LOADING_PROJECT,
    message: `Couldn't load project ${project.projectName} @ ${project.basePath} error = ${err}`,
    time: moment(),
    timestamp: moment().format('MM-D-YYYY, h:mm:ss a'),
  };
}

function loadProject(project) {
  return dispatch => {
    dispatch(requestProject(project));
    return appConfig.loadProject(project.basePath, defaultConfig)
      .then(response => dispatch(receiveProject(response)))
      .catch(err => dispatch(loadProjectError(err, project)));
  };
}


function loadProjects(projects) {
  return dispatch => {
    projects.forEach(val => dispatch(loadProject(val)));
  };
}


function addingProject(path, name) {
  return {
    type: ADDING_PROJECT,
    message: `Adding project ${name}`,
    time: moment(),
    timestamp: moment().format('MM-D-YYYY, h:mm:ss a'),
  };
}

function addedProject(projObj) {
  return {
    type: ADDED_PROJECT,
    projObj,
  };
}

function loadConfigError(err) {
  return {
    type: ERROR_LOADING_CONFIG,
    message: `Couldn't load config file: error = ${err}`,
    time: moment(),
    timestamp: moment().format('MM-D-YYYY, h:mm:ss a'),
  };
}

export function loadConfig() {
  return dispatch => {
    dispatch(requestConfig());
    return appConfig.loadConfigFile(defaultConfig)
      .then(response => {
        dispatch(receiveConfig(response));
        dispatch(loadProjects(response.projects));
      })
      .catch(err => dispatch(loadConfigError(err)));
  };
}

function addProjectError(err, name) {
  return {
    type: ERROR_ADDING_PROJECT,
    message: `Couldn't add ${name}: error = ${err}`,
    time: moment(),
    timestamp: moment().format('MM-D-YYYY, h:mm:ss a'),
  };
}

export function addProject(path, name) {
  return dispatch => {
    dispatch(addingProject(path, name));
    return projConfig.initProject(path, name)
      .then(response => dispatch(addedProject(response)))
      .catch(err => dispatch(addProjectError(err, name)));
  };
}

export function redirectHome() {
  return dispatch => dispatch(push('/'));
}

export function loadImages(images) {
  return {
    type: LOAD_IMAGES,
    images,
  };
}

export function getImages(projectName) {
  return (dispatch, getState) => {
    const { projects } = getState();
    const containers = projects[projectName].containers
      .map(used => used.image);
    const images = availableImages.getImages()
      .map(image => ({
        ...image,
        used: containers.indexOf(image) > -1,
      }));
    dispatch(loadImages(images));
  };
}

export function toggleImage(image, idx) {
  return {
    type: TOGGLE_SELECT_IMAGE,
    image,
    idx,
  };
}
