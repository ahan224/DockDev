import React from 'react';
import {Link} from 'react-router';

const initPage = ({ params, context }) => (

<div className="loader-wrapper">
  <main>
    <div className="wrapper">
      <aside className="aside aside-1-loader">
        <img src="./client/images/png/DD-icon-text@2x.png"></img>
      </aside>
      <aside className="aside">

      </aside>
      <aside className="aside aside-2-loader load-text">
       ..Checking for Docker config files
      </aside>
    </div>
  </main>
</div>
);

initPage.propTypes = {
  params: React.PropTypes.object,
};

export default initPage;
