import React from 'react';
import { Link } from 'react-router';

const ProjectLinks = ({ projects }) => {
  projects = projects || [];
  const projLinks = projects.map((proj, idx) => (
      <li key={idx} className="nav-item">
        <Link className="nav-link" to={`/projects/${proj}`}>{proj}</Link>
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
