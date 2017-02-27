import React from 'react';
import Toolbar from './Toolbar';

export const SignInHeader = React.createClass({
  render: function() {
    return <Toolbar>
      <a href="/" style={{
        position: 'absolute', left: '10px',
        color: '#eb8f50',
        fontSize: '20px', lineHeight: '50px',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
      }}>
        <i style={{paddingTop: '.3em', color: '#ccc'}} className="fa fa-chevron-left pull-left" aria-hidden="true"></i>
        Back
      </a>
      <div style={{
        textAlign: 'center', fontSize: '20px', lineHeight: '50px',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
      }}>{this.props.target}</div>
    </Toolbar>
  }
});

export default SignInHeader;
