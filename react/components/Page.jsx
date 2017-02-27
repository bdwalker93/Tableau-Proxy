import React from 'react';
import Toolbar from './Toolbar';

export const Page = React.createClass({
  render: function() {
    const { renderToolbar, children } = this.props;
    return <div style={{backgroundColor: '#f9f9f9', height: '100vh'}}>
      <Toolbar>{renderToolbar()}</Toolbar>
      {children}
    </div>
  }
});

export default Page;
