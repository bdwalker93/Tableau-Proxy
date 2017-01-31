import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';
import './VizPage.less';
import { VizHeader} from './VizHeader';

var BzIframe = React.createClass({

  propTypes: {
    src: React.PropTypes.string.isRequired,
    onLoad: React.PropTypes.func
  },

  componentDidMount: function() {
    this.refs.iframe.addEventListener('load', () => {
      this.props.onLoad(this.refs.iframe);
    });
  },

  render: function() {
    return <iframe ref="iframe" {...this.props}/>;
  }
});

const Viz = ({
}) =>
  <div className="viz-page">
    <VizHeader/>
    <BzIframe onLoad={(iframe)=>{
      if (!  iframe.contentWindow )  return ;
      let $ = iframe.contentWindow.jQuery;
      let t = $('.tableau')[0];
      let zoom = t.clientWidth / t.scrollWidth * 100;
      $(t).css({zoom: zoom+'%'});
    }} src="/t/UCI/views/Project_Spending/JODetailReport?:embed=y&:showVizHome=n&:toolbar=top&:openAuthoringInTopWindow=true&:browserBackButtonUndo=true&:reloadOnCustomViewSave=true&:showShareOptions=true&:size=100,183"/>
  </div>

function mapStateToProps(state) {
  // console.log(state.workbooks);
  return {}
}

export const VizPage = connect(mapStateToProps, actionCreators)(Viz);
