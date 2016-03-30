import React from 'react';
import NavLink from './NavLink';
import ProjectLinks from './ProjectLinks';
import * as projConfig from './server/projConfig.js';
import * as appConfig from './server/appConfig.js';
import defaultConfig from './server/defaultConfig.js';
import Icons from './icons';
import addFolderIcon from './AddFolderIcon.js';

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.addNewProject = this.addNewProject.bind(this);
    this.addExistingProjects = this.addExistingProjects.bind(this);
    this.addContainer = this.addContainer.bind(this);
    this.addAppConfig = this.addAppConfig.bind(this);
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

  addContainer(uuid, containerObj) {
    const projects = this.state.projects;
    projects[uuid].containers[containerObj.containerId] = containerObj;
    this.setState({ projects });
    projConfig.writeProj(projects[uuid]);
  }

  exampleClick(e){
    console.log(e.target);
  }

  render() {
    return (
      <div>
        <ul role="nav" id="menu" className="nav">
          <li className="nav-item proj-anchor">
            <NavLink to="/" onlyActiveOnIndex>
              <label onClick={this.exampleClick}>
                Projects
              </label>
              <span className="add-proj-icon">
                  <NavLink to="/addProject" className="add-proj-icon">
                    <img src="../src/client/images/x_folder-add.png"></img>
                  </NavLink>
              </span>
            </NavLink>
          </li>
          <ProjectLinks projects={this.state.projects} />
        </ul>
          <div id="right-column">
            <div className="content-top-nav">
             <div className="btn-group btn-group-sm" role="group" aria-label="...">
               <button type="button" className="btn btn-secondary">
               </button>
                 <button type="button" className="btn btn-secondary">
                  <div style={svgStyle}>
                    <svg style={svgStyle}>
                      <circle cx={8} cy={6} r={6} fill="red" value="Status">
                        Status
                      </circle>
                    </svg>
                  </div>
                 </button>
                 <button type="button" className="btn btn-secondary">
                   <div>
                     <NavLink to="/settings">Settings</NavLink>
                   </div>
                 </button>

             </div>
            </div>
            <div id="content">
              {React.cloneElement(this.props.children,
                {
                  projects: this.state.projects,
                  addNewProject: this.addNewProject,
                  addContainer: this.addContainer,
                  context: this.context,
                  exampleClick: this.exampleClick,
                  icons: this.icons,
                }
              )}
            </div>
          </div>
        </div>
    );
  }
}

let svgStyle = {
  width: '16px',
  height: '16px'
};

App.propTypes = {
  children: React.PropTypes.object,
};

App.contextTypes = {
  router: React.PropTypes.object.isRequired,
};


export default App;
