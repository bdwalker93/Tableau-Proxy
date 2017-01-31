import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';
import './VizPage.less';

const Viz = ({
}) =>
  <div className="viz-page">
    <iframe src="/t/UCI/views/Project_Spending/JODetailReport?:embed=y&:showVizHome=n&:toolbar=top&:openAuthoringInTopWindow=true&:browserBackButtonUndo=true&:reloadOnCustomViewSave=true&:showShareOptions=true&:size=100,183"/>
  </div>

function mapStateToProps(state) {
  // console.log(state.workbooks);
  return {}
}

export const VizPage = connect(mapStateToProps, actionCreators)(Viz);
