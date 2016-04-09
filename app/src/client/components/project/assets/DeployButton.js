import React from 'react';
import { Link } from 'react-router';

const DeployButton = ({ uuid }) => (
  <div className="deploy-button">
    <Link className="nav-link btn btn-primary" to={`/projects/${uuid}/deploy`}>Deploy</Link>
  </div>
);

DeployButton.propTypes = {
  uuid: React.PropTypes.string,
};

export default DeployButton;
