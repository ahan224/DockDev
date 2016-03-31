import React from 'react';
import NavLink from './NavLink';
import ProjectLinks from './ProjectLinks';
import * as projConfig from './server/projConfig.js';
import * as appConfig from './server/appConfig.js';
import defaultConfig from './server/defaultConfig.js';
import addFolderIcon from './AddFolderIcon';
import * as container from './server/container.js';
import * as manageProj from './server/manageProj.js';
import fileWatch from './server/fileWatch.js';
import Icons from './icons';

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
    this.state = {
      projects: {},
      activeProject: '',
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
      });
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
    projConfig.initProject(path, name, true)
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
    manageProj.stopProject(projects[uuid])
      .then(proj => {
        if (proj.uuid === this.state.activeProject) {
          this.setState({ activeProject: '' });
        }
      })
      .catch();
  }

  startProject(uuid) {
    const projects = this.state.projects;
    const activeProject = projects[this.state.activeProject];
    manageProj.startProject(projects[uuid], activeProject)
      .then(proj => {
        projects[uuid] = proj;
        this.setState({ projects });
        this.setState({ activeProject: proj.uuid });
      })
      .catch();
  }

  restartProject(uuid) {
    const projects = this.state.projects;
    const activeProject = projects[this.state.activeProject];
    manageProj.restartProject(projects[uuid], activeProject)
      .then(proj => {
        this.setState({ activeProject: proj.uuid });
      })
      .catch();
  }

  removeProject(uuid) {
    const projects = this.state.projects;
    const activeProject = projects[this.state.activeProject];
    manageProj.removeProject(projects[uuid])
      .then(() => {
        if (activeProject === uuid) {
          this.setState({ activeProject: '' });
        }
        appConfig.removeProjFromConfig(projects[uuid], defaultConfig);
        this.context.router.replace('/');
        delete projects[uuid];
        this.setState({ projects });
      })
      .catch();
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
                    delContainer: this.delContainer,
                    context: this.context,
                    exampleClick: this.exampleClick,
                    addFileWatcher: this.addFileWatcher,
                    activeProject: this.state.activeProject,
                    stopProject: this.stopProject,
                    startProject: this.startProject,
                    restartProject: this.restartProject,
                    removeProject: this.removeProject,
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
