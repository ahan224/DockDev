import React from 'react';
import TopNavList from './TopNavList.js';
import ProjectList from './ProjectList.js';
import BottomNavList from './BottomNavList.js';


// SIDEMENU ////////////////////////////////////
// NOTE : Ul element where the side navigation and project list will populate
// Relationship: App > Sidemenu
// Children: TopNavList, ProjectList, BottomNavList
// /////////////////////////////////////////////
const SideMenu = ({projects,addProject}) => {
  return (
    <div className="pane-sm sidebar">
      <TopNavList  addProject={addProject}/>
      <ProjectList projects={projects}  />
      <BottomNavList/>
    </div>
  )
}

export default SideMenu;
