import React from 'react';
import { Link } from 'react-router';
import { utils } from './server/main';

const ProjectLinks = ({ projects }) => {
  const projArray = utils.projectsObjToArray(projects);
  const projLinks = projArray.map((proj, idx) => (
      <li key={idx} className="nav-item">
        <Link className="nav-link" to={`/projects/${proj.cleanName}`}>{proj.projectName}</Link>
      </li>
    )
  );

  return (
    <div id="projectMenu">
      <ul className="nav">
        {projLinks}
      </ul>
    </div>
  );
};

ProjectLinks.propTypes = {
  projects: React.PropTypes.object,
};

export default ProjectLinks;
