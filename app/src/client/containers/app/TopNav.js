import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { redirect } from '../../actions/index';

const TopNav = ({ settings }) => (
  <div className="content-top-nav">
   <div className="btn-group top-nav-btn-group" data-toggle="buttons">
     <label className="btn btn-primary active">
      <input type="radio" name="options" id="option1" autoComplete="off"></input>
        <img src="./client/images/png/music@2x.png"></img>
     </label>
     <label className="btn btn-primary">
       <input type="radio" name="options" id="option2" autoComplete="off"></input>
         <img src="./client/images/png/power@2x.png"></img>
     </label>
     <label className="btn btn-primary" onClick={settings}>
       <input type="radio" name="options" id="option3" autoComplete="off"></input>
         <img src="./client/images/png/tool@2x.png"></img>
     </label>
   </div>
  </div>
);

TopNav.propTypes = {
  settings: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    settings: () => dispatch(redirect('settings')),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopNav);
