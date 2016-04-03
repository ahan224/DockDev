import React from 'react';
import { Link } from 'react-router';

const TopNav = ({ activeProject }) => (
  <div className="content-top-nav">
   <div className="btn-group top-nav-btn-group" data-toggle="buttons">

     <label className="btn btn-primary active">
       <input type="radio" name="options" id="option1" autoComplete="off" />
       <Link className="nav-link" to={'/settings'}>
         <img src="./client/images/png/music@2x.png"></img>
       </Link>
     </label>

     <label className="btn btn-primary activeProj">
       <input type="radio" name="options" id="option2" autoComplete="off" />
       <Link className="nav-link" to={`/projects/${activeProject}`}>
         <img src="./client/images/png/power@2x.png"></img>
       </Link>
     </label>

     <label className="btn btn-primary">
       <input type="radio" name="options" id="option3" autoComplete="off" />
       <Link className="nav-link" to={'/settings'}>
         <img src="./client/images/png/tool@2x.png"></img>
       </Link>
     </label>

   </div>
  </div>
);

TopNav.propTypes = {
  activeProject: React.PropTypes.string,
};

export default TopNav;
