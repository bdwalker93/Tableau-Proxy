import React from 'react';
import { Link } from 'react-router'

import './VizHeader.less';

export const VizHeader = ({
}) =>
  <div className="viz-header">
    <button onClick={()=>{
      window.history.back()
    }}>back</button>
  </div>
