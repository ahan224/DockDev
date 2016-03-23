import React from 'react';
import { Link } from 'react-router';
import R from 'ramda';

const ProjectList = ({ projects }) => {
  const projArray = R.toPairs(projects);
  const projLinks = projArray.map(proj => (
      <li key={proj[1].uuid}>
        <Link to={`/projects/${proj[1].uuid}`}>{proj[1].projectName}</Link>
      </li>
    )
  );

  return (
    <div id="projectMenu">
      <ul>
        {projLinks}
      </ul>
    </div>
  );
};

ProjectList.propTypes = {
  projects: React.PropTypes.object
};

export default ProjectList;
