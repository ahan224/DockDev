import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const ProjectNav = (props) => {
  const projectName = props.params.projectName;

  const remove = '';

  return (
    <div >
      <div className="proj-nav">
        <div className="col-xs-4 proj-detail-title" style={{ padding: '0px' }}>
          <h5 className="text-capitalize">
            {projectName}
          </h5>
        </div>
        <div className="btn-group container-player-btns" data-toggle="buttons">
          <label className="btn btn-primary active">
            <input type="radio" name="options" id="option1" autoComplete="off" />
              <img src="./client/images/png/arrow@2x.png" onClick={props.clickStartProject}>
              </img>
          </label>
          <label className="btn btn-primary">
            <input type="radio" name="options" id="option2" autoComplete="off" />
              <img src="./client/images/png/shapes@2x.png" onClick={props.clickStopProject}></img>
          </label>
          <label className="btn btn-primary">
            <input type="radio" name="options" id="option3" autoComplete="off" />
              <img src="./client/images/png/arrows@2x.png" onClick={props.clickRestartProject}></img>
          </label>
          <label className="btn btn-primary">
            <input type="radio" name="options" id="option3" autoComplete="off" />
              <img src="./client/images/png/arrows@2x.png" onClick={remove}></img>
          </label>
        </div>
        <ul className="nav nav-inline">
            <li className="nav-item">
              <Link className="nav-link" to={`/projects/${projectName}`}>
                H
              </Link>
            </li>
          <li className="nav-item">
            <Link className="nav-link" to={`/projects/${projectName}/container`}> +
            </Link>
          </li>
            <li className="nav-item">
              <Link className="nav-link" to={`/projects/${projectName}/deploy`}>Deploy</Link>
            </li>
        </ul>
      </div>
      {React.cloneElement(props.children, props)}
    </div>
  );
};

ProjectNav.propTypes = {
  children: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  clickStartProject: PropTypes.func.isRequired,
  clickStopProject: PropTypes.func.isRequired,
};

export default ProjectNav;
