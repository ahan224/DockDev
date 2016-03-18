import React from 'react';

const BottomNavList = ({ settingsClick }) => {
  return (
    <div>
      <ul className="list-group container-list bottom-nav">
        <li className="list-group-item add-container">
          <button type="button" name="button" onClick={settingsClick}>
            <img className="icon" src="./icons/Userinterface_setting-roll.svg">
            </img>
          </button>
        </li>
      </ul>
    </div>
  )
}

export default BottomNavList;
