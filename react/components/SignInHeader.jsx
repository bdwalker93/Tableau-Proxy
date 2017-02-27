import React from 'react';
import Toolbar from './Toolbar';

export const SignInHeader = React.createClass({
  render: function() {
    return <Toolbar>
      <a href="/">Back</a>
      <span>{this.props.PROXY_TARGET}</span>
    </Toolbar>
  }
});

export default SignInHeader;
