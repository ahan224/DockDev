import React from 'react';
import NavLink from './NavLink';
import ProjectLinks from './ProjectLinks';
import * as projConfig from './build/server/projConfig.js';
import * as appConfig from './build/server/appConfig.js';
import defaultConfig from './build/server/defaultConfig.js';

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.addNewProject = this.addNewProject.bind(this);
    this.addExistingProjects = this.addExistingProjects.bind(this);
    this.addContainer = this.addContainer.bind(this);
    this.testRedirect = this.testRedirect.bind(this);
    this.state = {
      projects: {}
    };
  }

  componentDidMount() {
    const getConfig = appConfig.initApp(defaultConfig, this.context.router);

    // add config object to state
    getConfig.then(config => this.setState({ config }));

    // load exising projects into state
    getConfig.then(config => appConfig.loadPaths(config, defaultConfig, this.addExistingProjects));
  }

  addExistingProjects(proj) {
    const projects = this.state.projects;
    projects[proj.uuid] = proj;
    this.setState({ projects });
  }

  addNewProject(userSelection) {
    projConfig.initProject(userSelection.basePath, userSelection.projectName, true)
      .then(proj => {
        const projects = this.state.projects;
        projects[proj.uuid] = proj;
        this.setState({ projects });
      })
      .catch();
  }

  addContainer(uuid, containerObj) {
    const projects = this.state.projects;
    projects[uuid].containers[containerObj.containerId] = containerObj;
    this.setState({ projects });
    projConfig.writeProj(projects[uuid]);
  }

  testRedirect() {
    this.context.router.replace('/');
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
            testRedirect: this.testRedirect,
            context: this.context
          }
        )}
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.object
};

App.contextTypes = {
  router: React.PropTypes.object.isRequired
};


export default App;
