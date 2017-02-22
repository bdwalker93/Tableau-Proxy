import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

const ServerSelection = (props) => {
  return <div className="server-selection-page">
    <input type="text" value="test"/>
  </div>
}

function mapStateToProps(state) {
  return {
  }
}

export const ServerSelectionPage = connect(mapStateToProps, actionCreators)(ServerSelection); 
