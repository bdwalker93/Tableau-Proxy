import React from 'react';

export const Toolbar = (props)=>
  <div style={{width: '100%', height: '50px', backgroundColor: 'white', borderBottom: '1px solid #eee', color: '#2f2f2f', position: 'relative'}}>{props.children}</div>;

export default Toolbar;
