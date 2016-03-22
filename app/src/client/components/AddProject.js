import React from 'react';

export default () => (
  <div id="content">
    <h2>Add Project</h2>
    <p id="addText">
      DockDev will create a container for you
      after you assign a name and select a folder/create a directory.
    </p>
    <input className="form-control form-control-lg" type="text" placeholder="Name" />
    <button type="button" className="btn btn-primary-outline btn-block">Select Path</button>
  </div>
);
