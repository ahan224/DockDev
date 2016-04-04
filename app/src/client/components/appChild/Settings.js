import React from 'react';
import { remote } from 'electron';

const Settings = ({ DOToken, updateToken }) => (
  <div>
    <div className="col-sm-8">
      <h5>Root Path</h5>
      <div className="col-xs-12 form-input-spacing">
        <label className="file width-12">
          <input type="file" id="file" />
          <span className="file-custom border-bottom-input padding-left-none" ></span>
        </label>
      </div>
      <div className="col-xs-12 form-input-spacing">
        <h5>Digital Ocean Token</h5>
        <input
          className="form-control form-control-lg border-bottom-input padding-left-none"
          value={DOToken}
          onChange={updateToken}
          type="text"
        />
      </div>
    </div>
  </div>

);

Settings.propTypes = {
  updateToken: React.PropTypes.func,
  DOToken: React.PropTypes.string,
};

// onClick={popFileSelector}
// onChange={projNameHandler}
//          placeholder={config}


export default Settings;
