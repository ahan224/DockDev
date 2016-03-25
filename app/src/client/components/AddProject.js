import React from 'react';
import { remote } from 'electron';

const AddProject = ({ addNewProject }) => {
  let projectName;
  let projectPath;

  const popFileSelector = () => {
    projectPath = remote.dialog
      .showOpenDialog({ properties: ['openDirectory', 'createDirectory'] })[0];
  };

  const projNameHandler = event => { projectName = event.target.value; };

  const submit = () => addNewProject(projectPath, projectName);

  return (
    <div id="content">
      <div className="content-top-nav"></div>

      <h2>Add Project</h2>
      <p id="addText">
        DockDev will create a container for you
        after you assign a name and select a folder/create a directory.
      </p>
      <input
        className="form-control form-control-lg"
        type="text"
        placeholder="Name"
        onChange={projNameHandler}
      />
      <button className="btn btn-primary-outline btn-block"onClick={popFileSelector}>
        Select Path
      </button>
      <button className="btn btn-primary-outline btn-block" onClick={submit}>
        Add
      </button>
    </div>
  );
};

AddProject.propTypes = {
  addNewProject: React.PropTypes.func,
};

export default AddProject;
