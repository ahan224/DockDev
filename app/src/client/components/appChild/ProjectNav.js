import React from 'react';
import { Link } from 'react-router';

const ProjectNav = (props) => {
  const uuid = props.params.uuid;
  const proj = props.projects[uuid];

  const start = () => props.startProject(uuid);
  const stop = () => props.stopProject(uuid);
  const restart = () => props.restartProject(uuid);
  const remove = () => props.removeProject(uuid);

  return (
    <div >
      <div className="proj-nav">
        <div className="col-xs-4 proj-detail-title" style={{ padding: '0px' }}>
          <h5 className="text-capitalize">
            {proj.projectName}
          </h5>
        </div>
        <div className="btn-group container-player-btns" data-toggle="buttons">
          <label className="btn btn-primary active">
            <input type="radio" name="options" id="option1" autoComplete="off" />
              <img src="./client/images/png/arrow@2x.png" onClick={start}></img>
          </label>
          <label className="btn btn-primary">
            <input type="radio" name="options" id="option2" autoComplete="off" />
              <img src="./client/images/png/shapes@2x.png" onClick={stop}></img>
          </label>
          <label className="btn btn-primary">
            <input type="radio" name="options" id="option3" autoComplete="off" />
              <img src="./client/images/png/arrows@2x.png" onClick={restart}></img>
          </label>
          <label className="btn btn-primary">
            <input type="radio" name="options" id="option3" autoComplete="off" />
              <img src="./client/images/png/shapes@2x.png" onClick={remove}></img>
          </label>
        </div>
        <ul className="nav nav-inline">
            <li className="nav-item">
              <Link className="nav-link" to={`/projects/${uuid}`}>
                H
              </Link>
            </li>
          <li className="nav-item">
            <Link className="nav-link" to={`/projects/${uuid}/container`}> +
            </Link>
          </li>
            <li className="nav-item">
              <Link className="nav-link" to={`/projects/${uuid}/deploy`}>Deploy</Link>
            </li>
        </ul>
      </div>
      {React.cloneElement(props.children, props)}
    </div>
  );
};

ProjectNav.propTypes = {
  children: React.PropTypes.object,
  projects: React.PropTypes.object,
  params: React.PropTypes.object,
  addContainer: React.PropTypes.func,
  context: React.PropTypes.object,
  delContainer: React.PropTypes.func,
  activeProject: React.PropTypes.string,
  startProject: React.PropTypes.func,
  stopProject: React.PropTypes.func,
  restartProject: React.PropTypes.func,
  removeProject: React.PropTypes.func,
  deployProject: React.PropTypes.func,
};


// projects,
// addContainer,
// delContainer,
// children,
// params,
// context,
// activeProject,
// startProject,
// stopProject,
// restartProject,
// removeProject,
// deployProject,

// projects,
// addContainer,
// context,
// delContainer,
// addFileWatcher,
// activeProject,
// startProject,
// stopProject,
// restartProject,
// removeProject,
// deployProject,

export default ProjectNav;
