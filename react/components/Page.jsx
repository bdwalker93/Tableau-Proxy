import React from 'react';
import Toolbar from './Toolbar';

export const Page = React.createClass({
  render: function() {
    return <div style={{backgroundColor: '#f9f9f9', height: '100vh'}}>
      {this.props.children}
    </div>
  }
});

export default Page;
