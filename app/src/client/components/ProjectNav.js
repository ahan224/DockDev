import React from 'react';
import { Link } from 'react-router';

const ProjectNav = ({ projects, children, params }) => (
  <div id="content">
    <div className="content-top-nav">
      <ul className="nav nav-inline">
        <li className="nav-item">
          <a className="nav-link" href="#">
            <Link to={`/projects/${params.uuid}`}>General</Link>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
           <Link to={`/projects/${params.uuid}/deploy`}>Deploy</Link>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            <Link to={`/projects/${params.uuid}/settings`}>Settings</Link>
          </a>
        </li>
      </ul>

    </div>
    {React.cloneElement(children, { projects })}
  </div>
);

ProjectNav.propTypes = {
  children: React.PropTypes.object,
  projects: React.PropTypes.object,
  params: React.PropTypes.object
};


export default ProjectNav;


{/*<div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
  <button type="button" className="btn btn-secondary">
    <Link to={`/projects/${params.uuid}`}>General</Link>
  </button>
  <button type="button" className="btn btn-secondary">
   <Link to={`/projects/${params.uuid}/deploy`}>Deploy</Link>
  </button>
  <button type="button" className="btn btn-secondary">
    <Link to={`/projects/${params.uuid}/settings`}>Settings</Link>
  </button>
</div>*/}

{/*<ul>
  <li><Link to={`/projects/${params.uuid}`}>General</Link></li>
  <li><Link to={`/projects/${params.uuid}/settings`}>Settings</Link></li>
  <li><Link to={`/projects/${params.uuid}/deploy`}>Deploy</Link></li>
</ul>*/}
