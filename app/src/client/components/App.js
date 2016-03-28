import React from 'react';
import NavLink from './NavLink';
import ProjectLinks from './ProjectLinks';
import * as projConfig from './server/projConfig.js';
import * as appConfig from './server/appConfig.js';
import defaultConfig from './server/defaultConfig.js';

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.addNewProject = this.addNewProject.bind(this);
    this.addExistingProjects = this.addExistingProjects.bind(this);
    this.addContainer = this.addContainer.bind(this);
    this.addAppConfig = this.addAppConfig.bind(this);
    this.delContainer = this.delContainer.bind(this);
    this.state = {
      projects: {},
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

  addContainer(uuid, status) {
    const projects = this.state.projects;

    if (status.status === 'pending') {
      let data = '';
      if (projects[uuid].containers[status.containerId]) {
        data = projects[uuid].containers[status.containerId].data + status.data.toString();
      }
      projects[uuid].containers[status.containerId] = {
        containerId: status.containerId,
        status: 'pending',
        data,
        image: status.image,
      };
    }

    if (status.status === 'error') {
      projects[uuid].containers[status.containerId] = {
        containerId: status.containerId,
        status: 'error',
        err: status.err.toString(),
        image: status.image,
      };
    }

    if (status.status === 'complete') {
      delete projects[uuid].containers[status.tmpContainerId];
      projects[uuid].containers[status.containerId] = status;
    }

    projConfig.writeProj(projects[uuid]);
    this.setState({ projects });
  }

  // need to delete container from docker - handle pending/error containers
  delContainer(uuid, container) {
    const projects = this.state.projects;
    delete projects[uuid].containers[container.containerId];
    projConfig.writeProj(projects[uuid]);
    this.setState({ projects });
  }

  togglePopover() {
    $('[data-toggle="popover"]').popover();
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
            context: this.context,
            togglePopover: this.togglePopover,
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
