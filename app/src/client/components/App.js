import React from 'react';
import NavLink from './NavLink';
import ProjectLinks from './ProjectLinks';
import * as projConfig from './server/projConfig.js';
import * as appConfig from './server/appConfig.js';
import defaultConfig from './server/defaultConfig.js';
import * as container from './server/container.js';
import fileWatch from './server/fileWatch.js';

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.addNewProject = this.addNewProject.bind(this);
    this.addExistingProjects = this.addExistingProjects.bind(this);
    this.addContainer = this.addContainer.bind(this);
    this.addAppConfig = this.addAppConfig.bind(this);
    this.delContainer = this.delContainer.bind(this);
    this.manageProjects = this.manageProjects.bind(this);
    this.addFileWatcher = this.addFileWatcher.bind(this);
    this.state = {
      projects: {},
      activeProject: false,
    };
  }

  componentDidMount() {
    appConfig.initApp(
      defaultConfig,
      this.context.router,
      this.addAppConfig,
      this.addExistingProjects
    );
  }

  addExistingProjects(proj) {
    const projects = this.state.projects;
    projects[proj.uuid] = proj;
    this.setState({ projects });
  }

  manageProjects(callback, uuid) {
    const projects = this.state.projects;
    const activeProject = this.state.activeProject;

    // if start or restart are the commands, stop the currently active project
    if (activeProject && (callback === container.start || callback === container.restart)) {
      for (let containerId in projects[activeProject].containers) {
        container.stop(projects[activeProject].machine, containerId);
        projects[activeProject].fileWatcher.close();
      }
    }

    let server;
    // perform the callback (start, stop, restart, or remove) on all the containers
    for (let containerId in projects[uuid].containers) {
      if (projects[uuid].containers[containerId].server) {
        server = projects[uuid].containers[containerId];
      }
      callback(projects[uuid].machine, containerId);
    }

    // check file watching for start, restart and stop
    if (server) {
      if (callback === container.start || callback === container.restart) {
        this.addFileWatcher(uuid);
      }
      if (callback === container.stop) {
        projects[uuid].fileWatcher.close();
      }
    }


    if (callback === container.remove) {
      appConfig.removeProjFromConfig(projects[uuid], defaultConfig)
        .then(() => {
          this.context.router.replace('/');
          delete projects[uuid];
          this.setState({ projects });
        })
        .catch(err => console.log(err));
    }

    if ((callback === container.remove || callback === container.stop) && uuid === activeProject) {
      this.setState({ activeProject: false });
    } else {
      this.setState({ activeProject: uuid });
    }
  }

  addAppConfig(config) {
    this.setState({ config });
  }

  addNewProject(path, name) {
    projConfig.initProject(path, name, true)
      .then(proj => {
        const projects = this.state.projects;
        projects[proj.uuid] = proj;
        this.setState({ projects });
        this.context.router.replace(`/projects/${proj.uuid}`);
      })
      .catch();
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
    delete projects[uuid].containers[containerObj.containerId];
    projConfig.writeProj(projects[uuid]);
    this.setState({ projects });
  }

  addFileWatcher(uuid) {
    const projects = this.state.projects;
    fileWatch(projects[uuid]);
    this.setState({ projects });
  }

  render() {
    return (
      <div>
        <ul role="nav" id="menu" className="nav">
          <li className="nav-item"><NavLink to="/" onlyActiveOnIndex>Home</NavLink></li>
          <li className="nav-item"><NavLink to="/addProject">Add Project</NavLink></li>
          <ProjectLinks projects={this.state.projects} />
        </ul>
        {React.cloneElement(this.props.children,
          {
            projects: this.state.projects,
            addNewProject: this.addNewProject,
            addContainer: this.addContainer,
            delContainer: this.delContainer,
            manageProjects: this.manageProjects,
            context: this.context,
            addFileWatcher: this.addFileWatcher,
          }
        )}
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
