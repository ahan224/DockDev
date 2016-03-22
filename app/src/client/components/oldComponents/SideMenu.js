import React from 'react';
import TopNavList from './TopNavList.js';
import ProjectList from './ProjectList.js';
import BottomNavList from './BottomNavList.js';


// SIDEMENU ////////////////////////////////////
// NOTE : Ul element where the side navigation and project list will populate
// Relationship: App > Sidemenu
// Children: TopNavList, ProjectList, BottomNavList
// /////////////////////////////////////////////

const SideMenu = ({projects, addProject, settingsClick, projectSelect}) => {
  return (
    <div className="pane-sm sidebar">
      <TopNavList addProject={addProject} />
      <ProjectList projects={projects} projectSelect={projectSelect} />
      <BottomNavList settingsClick={settingsClick}/>
    </div>
  )
}

export default SideMenu;
