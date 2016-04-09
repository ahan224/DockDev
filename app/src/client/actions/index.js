import { push } from 'react-router-redux';
import moment from 'moment';
import chokidar from 'chokidar';
import Promise from 'bluebird';
import {
  defaultConfig,
  appConfig,
  projConfig,
  availableImages,
  containerMgmt,
  rsync,
  docker,
  machine,
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
export const LOAD_IMAGES = 'LOAD_IMAGES';
export const TOGGLE_SELECT_IMAGE = 'TOGGLE_SELECT_IMAGE';
export const SETTING_UP_CONTAINER = 'SETTING_UP_CONTAINER';
export const ADDED_CONTAINER = 'ADDED_CONTAINER';
export const ERROR_CREATING_CONTAINER = 'ERROR_CREATING_CONTAINER';
export const PULLING_IMAGE = 'PULLING_IMAGE';
export const PULLED_IMAGE = 'PULLED_IMAGE';
export const ERROR_PULLING_IMAGE = 'ERROR_PULLING_IMAGE';
export const DELETED_CONTAINER = 'DELETED_CONTAINER';
export const ERROR_DELETING_CONTAINER = 'ERROR_DELETING_CONTAINER';
export const ERROR_STARTING_PROJECT = 'ERROR_STARTING_PROJECT';
export const START_PROJECT = 'START_PROJECT';
export const ERROR_STOPPING_PROJECT = 'ERROR_STOPPING_PROJECT';
export const STOPPED_PROJECT = 'STOPPED_PROJECT';
export const ERROR_SYNC_INFO = 'ERROR_SYNC_INFO';
export const ERROR_SYNCING_PROJECT = 'ERROR_SYNCING_PROJECT';
export const ERROR_RESTARTING_PROJECT = 'ERROR_RESTARTING_PROJECT';
export const ERROR_STARTING_CONTAINERS = 'ERROR_STARTING_CONTAINERS';
export const ERROR_STOPPING_CONTAINERS = 'ERROR_STOPPING_CONTAINERS';
export const ERROR_RESTARTING_CONTAINERS = 'ERROR_RESTARTING_CONTAINERS';
export const RESTARTED_PROJECT = 'RESTARTED_PROJECT';

function createMessage(type, message) {
  return {
    type,
    message,
    time: moment(),
    timestamp: moment().format('MM-D-YYYY, h:mm:ss a'),
  };
}

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
  return createMessage(
    REQUEST_PROJECT,
    `Trying to load ${project.projectName} @ ${project.basePath}`
  );
}

function receiveProject(projObj) {
  return {
    type: RECEIVE_PROJECT,
    projObj,
  };
}

function loadProjectError(err, project) {
  return createMessage(
    ERROR_LOADING_PROJECT,
    `Couldn't load project ${project.projectName} @ ${project.basePath} error = ${err}`
  );
}

function loadProject(project) {
  return dispatch => {
    dispatch(requestProject(project));
    return projConfig.loadProject(project.basePath)
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
  return createMessage(
    ADDING_PROJECT,
    `Adding project ${name}`
  );
}

function addedProject(projObj) {
  return {
    type: ADDED_PROJECT,
    projObj,
  };
}

function loadConfigError(err) {
  return createMessage(
    ERROR_LOADING_CONFIG,
    `Couldn't load config file: error = ${err}`
  );
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
  return createMessage(
    ERROR_ADDING_PROJECT,
    `Couldn't add ${name}: error = ${err}`
  );
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
        used: containers.indexOf(image.name) > -1,
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

export function settingUpContainer(projObj, imageObj) {
  return createMessage(
    SETTING_UP_CONTAINER,
    `We're setting up a ${imageObj.name} container for ${projObj.projectName}`
  );
}

export function addedContainer(containerObj) {
  return {
    type: ADDED_CONTAINER,
    containerObj,
  };
}

export function createContainerError(err, projObj, imageObj) {
  return createMessage(
    ERROR_CREATING_CONTAINER,
    `There was an error adding ${imageObj.name} to ${projObj.projectName}, err = ${err}`
  );
}

export function pullingImage(imageName, projectName) {
  return createMessage(
    PULLING_IMAGE,
    `Pulling ${imageName} for ${projectName}`
  );
}

export function pulledImage(containerObj, idx) {
  return {
    type: PULLED_IMAGE,
    containerObj,
    idx,
  };
}

export function pullImageError(containerObj, projectName) {
  return createMessage(
    ERROR_PULLING_IMAGE,
    `There was an error pulling ${containerObj.image} for ${projectName}`
  );
}

export function pullImage(containerObj) {
  return (dispatch, getState) => {
    const { projectName, basePath, containers } = getState().projects[containerObj.cleanName];
    const idx = projConfig.findContainer(containers, containerObj.name);
    dispatch(pullingImage(containerObj.image, projectName));
    return containerMgmt.pullImageForProject(containerObj, basePath)
      .then(response => {
        dispatch(pulledImage(response, idx));
        if (response.status === 'error') dispatch(pullImageError(containerObj, projectName));
      });
  };
}

export function createContainerStatus(containerObj) {
  return dispatch => {
    dispatch(addedContainer(containerObj));
    if (containerObj.status === 'pending') dispatch(pullImage(containerObj));
  };
}

export function createContainer(projObj, imageObj) {
  return dispatch => {
    dispatch(settingUpContainer(projObj, imageObj));
    return containerMgmt.createContainer(projObj, imageObj)
      .then(response => dispatch(createContainerStatus(response)))
      .catch(err => dispatch(createContainerError(err, projObj, imageObj)));
  };
}

export function clickAddContainers(cleanName) {
  return (dispatch, getState) => {
    const images = getState().availableImages;
    const projObj = getState().projects[cleanName];
    images.forEach(imageObj => {
      if (imageObj.selected) dispatch(createContainer(projObj, imageObj));
    });
  };
}

export function deletedContainer(containerObj, idx) {
  return {
    type: DELETED_CONTAINER,
    containerObj,
    idx,
  };
}

export function deleteContainerError(err, container, projectName) {
  return createMessage(
    ERROR_DELETING_CONTAINER,
    `There was an error deleting ${container.name} from ${projectName}, err = ${err}`
  );
}

export function clickDelContainer(containerObj) {
  return (dispatch, getState) => {
    const { projectName, basePath, containers } = getState().projects[containerObj.cleanName];
    const idx = projConfig.findContainer(containers, containerObj.name);
    return containerMgmt.deleteProjectContainer(containerObj, basePath)
      .then(() => dispatch(deletedContainer(containerObj, idx)))
      .catch(err => dispatch(deleteContainerError(err, containerObj, projectName)));
  };
}

function startProject(project, watcher) {
  return {
    type: START_PROJECT,
    project,
    watcher,
  };
}

function startProjectError(err, projectName) {
  return createMessage(
    ERROR_STARTING_PROJECT,
    `There was an error starting ${projectName}, err = ${err}`
  );
}

function startContainersError(err, projectName) {
  return createMessage(
    ERROR_STARTING_CONTAINERS,
    `There was an error starting containers for ${projectName}, err = ${err}`
  );
}

function startContainers(project, watcher) {
  return dispatch => {
    const containerArray = project.containers.map(cont =>
      docker.containerStart(cont.machine, cont.dockerId));
    Promise.all(containerArray)
      .then(() => dispatch(startProject(project, watcher)))
      .catch(err => dispatch(startContainersError(err, project.projectName)));
  };
}

function rsyncInfoError(err, project) {
  return createMessage(
    ERROR_SYNC_INFO,
    `There was an error grabbing syncing info for ${project.projectName}, err = ${err}`
  );
}

function fileWatchError(err, project) {
  return createMessage(
    ERROR_SYNCING_PROJECT,
    `There was an error syncing ${project.projectName}, err = ${err}`
  );
}

function fileWatching(project, syncArgs) {
  return dispatch => {
    const projectSync = () =>
      rsync.rsync(syncArgs)
        .catch(err => dispatch(fileWatchError(err, project)));
    const throttled = new rsync.ThrottleSync(projectSync, 100);
    const watcher = chokidar.watch(project.basePath);
    watcher.on('all', throttled.start.bind(throttled));
    return dispatch(startContainers(project, watcher));
  };
}

function rsyncProj(project) {
  return dispatch => {
    const basePath = rsync.cleanFilePath(project.basePath);
    const server = project.containers.filter(cont => cont.server);
    const destPath = server.dest;
    return machine.inspect(project.machine)
      .then(rsync.selectSSHandIP)
      .then(machineInfo =>
        dispatch(
          fileWatching(project, rsync.createRsyncArgs(`${basePath}/`, destPath, machineInfo)))
        )
      .catch(err => dispatch(rsyncInfoError(err, project)));
  };
}

export function clickStartProject(cleanName) {
  return (dispatch, getState) => {
    const { activeProject, projects } = getState();
    const project = projects[cleanName];
    if (activeProject.project) {
      const error =
        `Couldn't start ${project.projectName}, ${activeProject.project.projectName} is active`;
      return dispatch(startProjectError(error, project.projectName));
    }
    return dispatch(rsyncProj(project));
  };
}

function stopProjectError(err, projectName) {
  return createMessage(
    ERROR_STOPPING_PROJECT,
    `There was an error stopping ${projectName}, err = ${err}`
  );
}

function stopContainersError(err, projectName) {
  return createMessage(
    ERROR_STOPPING_CONTAINERS,
    `There was an error stopping containers for ${projectName}, err = ${err}`
  );
}

function stopProject(projectName) {
  return createMessage(
    STOPPED_PROJECT,
    `Project ${projectName} has stopped`
  );
}

function stopContainers(project) {
  return dispatch => {
    const containerArray = project.containers.map(cont =>
      docker.containerStop(cont.machine, cont.dockerId));
    Promise.all(containerArray)
      .then(() => dispatch(stopProject(project.projectName)))
      .catch(err => dispatch(stopContainersError(err, project.projectName)));
  };
}

export function clickStopProject(cleanName) {
  return (dispatch, getState) => {
    const { activeProject } = getState();
    if (activeProject.project.projectName !== cleanName) {
      const error =
        `Couldn't stop ${cleanName}, ${activeProject.project.projectName} is active`;
      return dispatch(stopProjectError(error, cleanName));
    }
    activeProject.watcher.close();
    return dispatch(stopContainers(activeProject.project));
  };
}

function restartProjectError(err, projectName) {
  return createMessage(
    ERROR_RESTARTING_PROJECT,
    `There was an error restarting ${projectName}, err = ${err}`
  );
}

function restartContainersError(err, projectName) {
  return createMessage(
    ERROR_RESTARTING_CONTAINERS,
    `There was an error restarting containers for ${projectName}, err = ${err}`
  );
}

function restartProject(err, projectName) {
  return createMessage(
    RESTARTED_PROJECT,
    `${projectName} was restarted`
  );
}

function restartContainers(project) {
  return dispatch => {
    const containerArray = project.containers.map(cont =>
      docker.containerRestart(cont.machine, cont.dockerId));
    Promise.all(containerArray)
      .then(() => dispatch(restartProject(project.projectName)))
      .catch(err => dispatch(restartContainersError(err, project.projectName)));
  };
}

export function clickRestartProject(cleanName) {
  return (dispatch, getState) => {
    const { activeProject } = getState();
    if (activeProject.project.projectName !== cleanName) {
      const error =
        `Couldn't restart ${cleanName}, ${activeProject.project.projectName} is active`;
      return dispatch(restartProjectError(error, cleanName));
    }
    activeProject.watcher.close();
    return dispatch(restartContainers(activeProject.project));
  };
}

export function clickReMoveProject(cleanName) {
  return (dispatch, getState) => {
    const { activeProject } = getState();
    if (activeProject.project.projectName !== cleanName) {
      const error =
        `Couldn't stop ${cleanName}, ${activeProject.project.projectName} is active`;
      return dispatch(stopProjectError(error, cleanName));
    }
    return dispatch(stopProject(activeProject.project.projectName));
  };
}
