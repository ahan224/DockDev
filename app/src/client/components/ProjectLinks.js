import React from 'react';
import { Link } from 'react-router';
import R from 'ramda';

const ProjectLinks = ({ projects }) => {
  const projArray = R.toPairs(projects);
  const projLinks = projArray.map(proj => (
      <li key={proj[1].uuid} className="nav-item">
        <a class="nav-link" href="#">
          <Link to={`/projects/${proj[1].uuid}`}>{proj[1].projectName}</Link>
        </a>
        {console.log(proj)}
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
  projects: React.PropTypes.object
};

export default ProjectLinks;
