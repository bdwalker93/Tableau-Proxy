import React from 'react';

export const Toolbar = (props)=>
  <div style={{
    width: '100%',
    height: props.height || '50px',
    minHeight: '50px',
    backgroundColor: 'white',
    borderBottom: '1px solid #eee',
    color: '#2f2f2f',
    position: 'fixed',
    zIndex: 15
  }}>{props.children}</div>;

export default Toolbar;
