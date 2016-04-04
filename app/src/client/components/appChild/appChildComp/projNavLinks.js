import React from 'react';
import { Link } from 'react-router';

const ProjNavLinks = ({ uuid }) => (
  <ul className="nav nav-inline">
    <li className="nav-item">
      <Link className="nav-link" to={`/projects/${uuid}`}>H</Link>
    </li>
    <li className="nav-item">
      <Link className="nav-link" to={`/projects/${uuid}/container`}>+</Link>
    </li>
    <li className="nav-item">
      <Link className="nav-link" to={`/projects/${uuid}/deploy`}>Deploy</Link>
    </li>
  </ul>
);

ProjNavLinks.propTypes = {
  uuid: React.PropTypes.string,
};

export default ProjNavLinks;
