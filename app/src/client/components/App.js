import React from 'react';
import NavLink from './NavLink';
import ProjectLinks from './ProjectLinks';
import * as projConfig from './build/server/projConfig.js';

class App extends React.Component {
  constructor() {
    super();
    this.addNewProject = this.addNewProject.bind(this);
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

  addNewProject(userSelection) {
    projConfig.initProject(userSelection.basePath, userSelection.projectName)
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
