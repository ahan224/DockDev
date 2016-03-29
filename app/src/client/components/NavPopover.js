import React from 'react';
import Popover from '@terebentina/react-popover';

// import '@terebentina/react-popover/lib/styles.css';

class NavPopover extends React.Component {
  render() {
    return (
      <div>
        If you want to see a nice popover
        <div class="popover popover--bottom popover--active">
          <a href="#" class="popover_trigger">your trigger here</a>
          <div class="popover_content">
            your content here
          </div>
        </div>
      </div>
    );
  }
}

export default NavPopover;
