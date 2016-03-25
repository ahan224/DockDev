import React from 'react';
import { remote } from 'electron';
<<<<<<< HEAD
import { Link } from 'react-router';

class AddProject extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.popFileSelector = this.popFileSelector.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addProject = this.addProject.bind(this);
  }

  popFileSelector() {
    this.setState({ basePath: remote.dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory'] })[0]
    });
  }

  handleChange(event) {
    this.setState({ projectName: event.target.value });
  }

  addProject() {
    this.props.addNewProject(this.state);
    console.log(this.state);
  }

  render() {
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
          value={this.state.projectName}
          onChange={this.handleChange}
        />
        <button className="btn btn-primary-outline btn-block"onClick={this.popFileSelector}>
          Select Path
        </button>
        <button className="btn btn-primary-outline btn-block" onClick={this.addProject}>
          Add
        </button>
        <button onClick={this.props.testRedirect}>Redirect?</button>
      </div>
    );
  }
}
=======

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
>>>>>>> 380aa529de45feb0b09edc4e46d1063aa5b1f772

AddProject.propTypes = {
  addNewProject: React.PropTypes.func,
};

export default AddProject;
