import React from 'react';
import NavLink from './NavLink';
import ProjectLinks from './ProjectLinks';
import * as projConfig from './server/projConfig.js';
import * as appConfig from './server/appConfig.js';
import defaultConfig from './server/defaultConfig.js';
import * as container from './server/container.js';

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.addNewProject = this.addNewProject.bind(this);
    this.addExistingProjects = this.addExistingProjects.bind(this);
    this.addContainer = this.addContainer.bind(this);
    this.addAppConfig = this.addAppConfig.bind(this);
    this.manageActiveProject = this.manageActiveProject.bind(this);
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

  manageActiveProject(callback, uuid) {
    const projects = this.state.projects;
    const activeProject = this.state.activeProject;
    if (activeProject &&
        callback === container.start ||
        callback === container.restart) {
      for (let containerId in projects[activeProject].containers) {
        console.log('stopAll', containerId);
        container.stop(projects[activeProject].machine, containerId);
      }
    }

    for (let containerId in projects[uuid].containers) {
      console.log('start', containerId);
      callback(projects[uuid].machine, containerId);
    }

    if ((callback === container.remove || callback === container.stop) &&
         uuid === activeProject) {
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

  addContainer(uuid, containerObj) {
    const projects = this.state.projects;
    projects[uuid].containers[containerObj.containerId] = containerObj;
    this.setState({ projects });
    projConfig.writeProj(projects[uuid]);
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
            manageActiveProject: this.manageActiveProject,
            context: this.context,
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
