import React from 'react';
import * as container from './build/server/container.js';

const AddContainer = ({ params, addContainer }) => {
  let image = '';
  const handler = event => {image = event.target.value;};

  const submit = () => {
    container.add(params.uuid, image)
      .then(result => addContainer(params.uuid, result));
  };

  return (
    <div>
      <div className="add-containers-description">
        <h2>Add containers</h2>
        <p>
          In order to give you the best user experience we only support Node.js environment.
          Be sure to register for DockDev updates.
        </p>
      </div>
      <input type="text" onChange={handler} />
      <button onClick={submit}>Submit</button>
      <div className="containers-servers">
        <h4>Servers</h4>
        <button className="button-container">
          <h4 className="text-container">Node</h4>
          <p className="text-version">v1.1.1.0</p>
          <p className="text-description">
          A Docker project management tool that automatically syncs files,
          seamlessly integrate Docker with existing workflow, and
          manage Docker projects and easily deploy them</p>
        </button>
      </div>
      <div className="containers-databases">
        <h4>Databases</h4>
        <button className="button-container">
          <h4 className="text-container">MongoDB</h4>
          <p className="text-version">v1.1.1.0</p>
          <p className="text-description">
          A Docker project management tool that automatically syncs files,
          seamlessly integrate Docker with existing workflow, and
          manage Docker projects and easily deploy them</p>
        </button>
        <button className="button-container">
          <h4 className="text-container">PostgresQL</h4>
          <p className="text-version">v1.1.1.0</p>
          <p className="text-description">
          A Docker project management tool that automatically syncs files,
          seamlessly integrate Docker with existing workflow, and
          manage Docker projects and easily deploy them</p>
        </button>
      </div>
    </div>
  );
};

AddContainer.propTypes = {
  params: React.PropTypes.object,
  addContainer: React.PropTypes.func
};


export default AddContainer;
