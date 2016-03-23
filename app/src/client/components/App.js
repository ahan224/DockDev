import React from 'react';
import NavLink from './NavLink';
import ProjectLinks from './ProjectLinks';
import * as projConfig from './build/server/projConfig.js';
import * as appConfig from './build/server/appConfig.js';
import defaultConfig from './build/server/defaultConfig.js';

class App extends React.Component {
  constructor() {
    super();
    this.addNewProject = this.addNewProject.bind(this);
    this.addExistingProjects = this.addExistingProjects.bind(this);
    this.state = {
      projects: {
        1: {
          projectName: 'project1',
          uuid: 1,
          basePath: ''
        }
      }
    };
  }

  componentDidMount() {
    const getConfig = appConfig.loadConfigFile(defaultConfig);

    // load exising projects into state
    getConfig.then(config => appConfig.loadPaths(config, this.addExistingProjects));
  }

  componentDidUpdate() {
    console.log(this.state);
  }

  addExistingProjects(proj) {
    console.log('running callback');
    const projObj = {};
    projObj[proj.uuid] = proj;
    this.setState({ projects: { projObj } });
  }

  addNewProject(userSelection) {
    projConfig.initProject(userSelection.basePath, userSelection.projectName, true)
      .then(proj => {
        const projObj = {};
        projObj[proj.uuid] = proj;
        this.setState({ projects: projObj });
      })
      .catch();
  }

  render() {
    return (
      <div>
        <div id="header">
          <h5>DockDev <small>beta</small></h5>
        </div>
        <ul role="nav" id="menu">
          <li><NavLink to="/" onlyActiveOnIndex>Home</NavLink></li>
          <li><NavLink to="/addProject">Add Project</NavLink></li>
          <ProjectLinks projects={this.state.projects} />
        </ul>
        {React.cloneElement(this.props.children,
          { projects: this.state.projects,
            addNewProject: this.addNewProject,
            selectProjectPath: this.selectProjectPath
          })}
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.object
};

export default App;
