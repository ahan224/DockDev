import React from 'react';
import R from 'ramda';

const Project = ({ projects, params }) => {
  const proj = R.toPairs(projects[params.id]);
  return (
    <div id="content">
      <div classNameName="content-wrapper">
        <div className="btn-group" role="group" aria-label="Button group with nested dropdown">
          <button type="button" className="btn btn-secondary">1</button>
          <button type="button" className="btn btn-secondary">2</button>

          <div className="btn-group" role="group">
            <button id="btnGroupDrop1" type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Dropdown
            </button>
            <div className="dropdown-menu" aria-labelledby="btnGroupDrop1">
              <a className="dropdown-item" href="#">Dropdown link</a>
              <a className="dropdown-item" href="#">Dropdown link</a>
            </div>
          </div>
        </div>
        <div classNameName="project-details">
          {proj}
        </div>
      </div>
    </div>
  );
};

Project.propTypes = {
  projects: React.PropTypes.object,
  params: React.PropTypes.object
};

export default Project;
