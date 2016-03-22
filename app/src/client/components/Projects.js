import React from 'react';
import { Link } from 'react-router';
import R from 'ramda';

const Projects = ({ projects }) => {
  const projArray = R.toPairs(projects);
  const projLinks = projArray.map(proj => (
      <li key={proj[1].uuid}>
        <Link to={`/projects/${proj[1].uuid}`}>{proj[1].projectName}</Link>
      </li>
    )
  );

  return (
    <div id="content">
      <ul>
        {projLinks}
      </ul>
    </div>
  );
};

Projects.propTypes = {
  projects: React.PropTypes.object
};

export default Projects;

// <Link to={`/projects/${proj.id}`}>{proj.projectName}</Link>
