import React from 'react';
import LeftNav from './appComp/LeftNav';
import TopNav from './appComp/TopNav';
import {
  projConfig,
  appConfig,
  defaultConfig,
  docker as container,
  manageProj,
  fileWatch,
  deploy,
  errorHandler,
} from './server/main';

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.addNewProject = this.addNewProject.bind(this);
    this.addExistingProjects = this.addExistingProjects.bind(this);
    this.addContainer = this.addContainer.bind(this);
    this.addAppConfig = this.addAppConfig.bind(this);
    this.delContainer = this.delContainer.bind(this);
    this.addFileWatcher = this.addFileWatcher.bind(this);
    this.stopProject = this.stopProject.bind(this);
    this.startProject = this.startProject.bind(this);
    this.restartProject = this.restartProject.bind(this);
    this.removeProject = this.removeProject.bind(this);
    this.deployProject = this.deployProject.bind(this);
    this.updateToken = this.updateToken.bind(this);
    this.errorCallback = this.errorCallback.bind(this);
    this.state = {
      projects: {},
      activeProject: '',
      DOToken: '',
    };
  }

  componentDidMount() {
    appConfig.initApp(
      defaultConfig,
      this.context.router,
      this.addAppConfig,
      this.addExistingProjects
    ).then(() => {
      // setInterval(() => machine.checkMachineRunning(defaultConfig), 5000);
    });
  }

  addExistingProjects(proj) {
    const projects = this.state.projects;
    projects[proj.uuid] = proj;
    this.setState({ projects });
  }

  addContainer(uuid, statusObj) {
    const projects = this.state.projects;

    if (statusObj.status === 'pending') {
      let data = '';
      if (projects[uuid].containers[statusObj.containerId]) {
        data = projects[uuid].containers[statusObj.containerId].data + statusObj.data.toString();
      }
      projects[uuid].containers[statusObj.containerId] = {
        containerId: statusObj.containerId,
        status: 'pending',
        data,
        image: statusObj.image,
      };
    }

    if (statusObj.status === 'error') {
      projects[uuid].containers[statusObj.containerId] = {
        containerId: statusObj.containerId,
        status: 'error',
        err: statusObj.err.toString(),
        image: statusObj.image,
      };
    }

    if (statusObj.status === 'complete') {
      delete projects[uuid].containers[statusObj.tmpContainerId];
      projects[uuid].containers[statusObj.containerId] = statusObj;
    }

    projConfig.writeProj(projects[uuid]);
    this.setState({ projects });
  }

  // need to delete container from docker - handle pending/error containers
  delContainer(uuid, containerObj) {
    const projects = this.state.projects;
    container.removeContainer(projects[uuid], containerObj.containerId)
      .then(() => {
        delete projects[uuid].containers[containerObj.containerId];
        projConfig.writeProj(projects[uuid]);
        this.setState({ projects });
      })
      .catch(err => errorHandler('delContainer', err, [uuid, containerObj]));
  }

  addFileWatcher(uuid) {
    const projects = this.state.projects;
    fileWatch(projects[uuid]);
    this.setState({ projects });
  }

  addAppConfig(config) {
    this.setState({ config });
  }

  addNewProject(path, name) {
    projConfig.initProject(path, name)
      .then(proj => {
        const projects = this.state.projects;
        projects[proj.uuid] = proj;
        this.setState({ projects });
        this.context.router.replace(`/projects/${proj.uuid}`);
      })
      .catch();
  }

  stopProject(uuid) {
    const projects = this.state.projects;
    manageProj.stopProject(projects[uuid], this.errorCallback)
      .then(proj => {
        if (proj.uuid === this.state.activeProject) {
          this.setState({ activeProject: '' });
        }
      })
      .catch(err => errorHandler('stopProject', err, [uuid], this.errorCallback));
  }

  startProject(uuid) {
    const projects = this.state.projects;
    const activeProject = projects[this.state.activeProject];
    manageProj.startProject(projects[uuid], activeProject, this.errorCallback)
      .then(proj => {
        projects[uuid] = proj;
        this.setState({ activeProject: proj.uuid });
      })
      .catch(err => errorHandler('startProject', err, [uuid], this.errorCallback));
  }

  restartProject(uuid) {
    const projects = this.state.projects;
    const activeProject = projects[this.state.activeProject];
    manageProj.restartProject(projects[uuid], activeProject, this.errorCallback)
      .then(proj => {
        this.setState({ activeProject: proj.uuid });
      })
      .catch(err => errorHandler('restartProject', err, [uuid], this.errorCallback));
  }

  removeProject(uuid) {
    const projects = this.state.projects;
    const activeProject = projects[this.state.activeProject];
    manageProj.removeProject(projects[uuid], this.errorCallback)
      .then(() => {
        if (activeProject === uuid) {
          this.setState({ activeProject: '' });
        }
        appConfig.removeProjFromConfig(projects[uuid], defaultConfig);
        this.context.router.replace('/');
        delete projects[uuid];
        this.setState({ projects });
      })
      .catch(err => errorHandler('removeProject', err, [uuid], this.errorCallback));
  }

  deployProject(uuid) {
    const DOToken = this.state.DOToken;
    const projects = this.state.projects;
    deploy.deployToOcean(projects[uuid], DOToken);
  }

  updateToken(e) {
    this.setState({ DOToken: e.target.value });
  }

  exampleClick(e) {
    console.log(e.target);
  }

  errorCallback(errorObj) {
    console.log(errorObj);
  }

  render() {
    return (
      <div>
        <LeftNav projects={this.state.projects} exampleClick={this.exampleClick} />
        <TopNav activeProject={this.state.activeProject} />

          <div id="right-column">
            <div id="content">
              {React.cloneElement(this.props.children,
                {
                  projects: this.state.projects,
                  addNewProject: this.addNewProject,
                  addContainer: this.addContainer,
                  delContainer: this.delContainer,
                  context: this.context,
                  exampleClick: this.exampleClick,
                  addFileWatcher: this.addFileWatcher,
                  activeProject: this.state.activeProject,
                  stopProject: this.stopProject,
                  startProject: this.startProject,
                  restartProject: this.restartProject,
                  removeProject: this.removeProject,
                  deployProject: this.deployProject,
                  updateToken: this.updateToken,
                  DOToken: this.state.DOToken,
                  errorCallback: this.errorCallback,
                }
              )}
            </div>
          </div>
        </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.object,
};

App.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

export default App;
