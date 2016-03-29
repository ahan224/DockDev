import * as container from './container.js';
import fileWatch from './fileWatch.js';
import Promise, { coroutine as co } from 'bluebird';

function applyCommand(action, projObj) {
  const output = [];
  const containersArray = Object.keys(projObj.containers);
  containersArray.forEach(val => {
    output.push(action(projObj.machine, val));
  });

  return output;
}

function getServer(projObj) {
  for (const cont in projObj.containers) {
    if (cont.server) return cont;
  }
}

export const stopProject = co(function *g(projObj) {
  const stopArray = applyCommand(container.stop, projObj);
  yield Promise.all(stopArray);
  if (projObj.fileWatcher) projObj.fileWatcher.close();
  return projObj;
});

export const startProject = co(function *g(projObj, activeProject, projects) {
  const server = getServer(projObj);

  if (activeProject) yield stopProject(projects[activeProject]);
  yield applyCommand(container.start, projObj);

  if (server) fileWatch(projObj);

  return projObj;
});

export const restartProject = co(function *g(projObj, activeProject, projects) {
  yield stopProject(projObj);
  yield startProject(projObj, activeProject, projects);

  return projObj;
});

export const removeProject = co(function *g(projObj, activeProject, projects) {
  yield stopProject(projObj);
  yield applyCommand(container.remove, projObj);
  yield container.networkDelete(projObj.machine, projObj.uuid);
})









// manageProjects(callback, uuid) {
//   const projects = this.state.projects;
//   const activeProject = this.state.activeProject;
//
//   // if start or restart are the commands, stop the currently active project
//   if (activeProject && (callback === container.start || callback === container.restart)) {
//     for (let containerId in projects[activeProject].containers) {
//       container.stop(projects[activeProject].machine, containerId);
//       projects[activeProject].fileWatcher.close();
//     }
//   }
//
//   let server;
//   // perform the callback (start, stop, restart, or remove) on all the containers
//   for (let containerId in projects[uuid].containers) {
//     if (projects[uuid].containers[containerId].server) {
//       server = projects[uuid].containers[containerId];
//     }
//     callback(projects[uuid].machine, containerId);
//   }
//
//   // check file watching for start, restart and stop
//   if (server) {
//     if (callback === container.start || callback === container.restart) {
//       this.addFileWatcher(uuid);
//     }
//     if (callback === container.stop) {
//       projects[uuid].fileWatcher.close();
//     }
//   }
//
//
//   if (callback === container.remove) {
//     appConfig.removeProjFromConfig(projects[uuid], defaultConfig)
//       .then(() => {
//         this.context.router.replace('/');
//         delete projects[uuid];
//         this.setState({ projects });
//       })
//       .catch(err => console.log(err));
//   }
//
//   if ((callback === container.remove || callback === container.stop) && uuid === activeProject) {
//     this.setState({ activeProject: false });
//   } else {
//     this.setState({ activeProject: uuid });
//   }
// }
//
// addAppConfig(config) {
//   this.setState({ config });
// }
//
// addNewProject(path, name) {
//   projConfig.initProject(path, name, true)
//     .then(proj => {
//       const projects = this.state.projects;
//       projects[proj.uuid] = proj;
//       this.setState({ projects });
//       this.context.router.replace(`/projects/${proj.uuid}`);
//     })
//     .catch();
// }
