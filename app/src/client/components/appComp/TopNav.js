import React from 'react';
import { Link } from 'react-router';

const TopNav = ({ activeProject }) => {
  let pathTo = '';
  let styling = {};
  let image = '';
  if (activeProject) {
    pathTo = `/projects/${activeProject}`;
    styling = { backgroundColor: 'lightGreen' };
    image = './client/images/png/power@2x.png';
  } else {
    pathTo = '/';
    styling = { backgroundColor: 'red' };
    image = './client/images/png/shapes@2x.png';
  }
  return (
    <div className="content-top-nav">
     <div className="btn-group top-nav-btn-group" data-toggle="buttons">

       <label className="btn btn-primary active">
         <input type="radio" name="options" id="option1" autoComplete="off" />
         <Link className="nav-link" to={'/settings'}>
           <img src="./client/images/png/music@2x.png"></img>
         </Link>
       </label>

       <label style={styling} className="btn btn-primary activeProj">
         <input type="radio" name="options" id="option2" autoComplete="off" />
         <Link className="nav-link" to={pathTo}>
           <img src={image}></img>
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
};

TopNav.propTypes = {
  activeProject: React.PropTypes.string,
};

export default TopNav;
