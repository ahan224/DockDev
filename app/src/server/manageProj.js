import * as container from './container.js';
import fileWatch from './fileWatch.js';
import { coroutine as co } from 'bluebird';
import { removeMachineFolder } from './machine.js';

const checkStatus = co(function *g(projObj, containerId) {
  return (yield container.inspect(projObj.machine, containerId)).State.Running;
});

const applyCommand = co(function *g(action, projObj) {
  const containersArray = Object.keys(projObj.containers);
  const actionCheck = action === container.start || action === container.remove;
  for (let i = 0; i < containersArray.length; i++) {
    if (actionCheck || (yield checkStatus(projObj, containersArray[i]))) {
      yield action(projObj.machine, containersArray[i]);
    }
  }

  return true;
});

function getServer(projObj) {
  for (const cont in projObj.containers) {
    if (projObj.containers[cont].server) return cont;
  }
  return undefined;
}

export const stopProject = co(function *g(projObj) {
  yield applyCommand(container.stop, projObj);
  if (projObj.fileWatcher) projObj.fileWatcher.close();
  return projObj;
});

export const startProject = co(function *g(projObj, activeProject) {
  const server = getServer(projObj);

  if (activeProject) yield stopProject(activeProject);
  yield applyCommand(container.start, projObj);

  if (server) fileWatch(projObj);

  return projObj;
});

export const restartProject = co(function *g(projObj, activeProject) {
  yield stopProject(projObj);
  yield startProject(projObj, activeProject);

  return projObj;
});

export const removeProject = co(function *g(projObj) {
  yield stopProject(projObj);
  yield applyCommand(container.remove, projObj);
  yield container.networkDelete(projObj.machine, projObj.uuid);

  return projObj;
});
