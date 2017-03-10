import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';
import './VizPage.less';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router';
import './VizHeader.less';
import FavoriteStar from './FavoriteStar';
import { browserHistory } from 'react-router';
import { Toolbar } from './Toolbar';
import Popover from './Popover';

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
  params: { tab },
  site,
  views,
  viewPath,
  deleteFavoriteView,
  addFavoriteView
}) => <div className="viz-page">
  <Toolbar>
    <div style={{textAlign: 'center', minHeight: '50px'}}>
      <Button  style={{float: 'left'}} onClick={()=>browserHistory.push('/app/workbooks/'+tab)}>
        <i style={{fontSize: '30px', paddingTop: '.2em', color: '#eb8f50', opacity: '0.8'}} className="fa fa-chevron-left pull-right" aria-hidden="true"></i>
      </Button>
      <span className="view-name">
        {views.map(view=> viewPath === view.path ? truncateViewName(view.name) : null)}
      </span>
      <Popover id="view-switcher" trigger={
        <Button style={{float: 'right'}}>
          <img src="/img/display_views_button.png" style={{
            width: '30px', 
            paddingTop: '4px' }} />
        </Button>
      }>
        {views.map(view=><div style={{marginLeft: '0px'}}key={view.id}>
        <Link to={`/app/workbooks/${tab}/${view.workbookId}/views/${view.path}`}>
          <FavoriteStar style={{paddingRight: '10px'}} onClick={(e)=>{
            e.preventDefault();
            e.stopPropagation();
            if ( view.isFavorite ) {
              deleteFavoriteView(view.id);
            } else {
              addFavoriteView(view.id);
            }
          }} isFavorite={view.isFavorite}/>
        <span style={{lineHeight: '29px'}}>
          {view.name}
        </span>
          { viewPath === view.path ? 
              <i className="fa fa-check" style={{lineHeight: '27px'}} aria-hidden="true"></i>
              : null 
          }
        </Link>
      </div>)}
    </Popover>
  </div>
</Toolbar>

{ site && viewPath ? 
            <BzIframe onLoad={(iframe)=>{
              if (!  iframe.contentWindow )  return ;
              // setTimeout(()=>{
              let $ = iframe.contentWindow.jQuery;
              let t = $('.tableau')[0];
              let zoom = t.clientWidth / t.scrollWidth * 100;
              $(t).css({zoom: zoom+'%'});
              //}, 0);
            }} src={`/t/${site}/views/${viewPath}?:embed=y&:showVizHome=n&:toolbar=top&:openAuthoringInTopWindow=true&:browserBackButtonUndo=true&:reloadOnCustomViewSave=true&:showShareOptions=true&:size=100,183`}/>
          : null }
</div>
  function truncateViewName(name){
    var trunkLength = 24;
    if(name.length > trunkLength){
      return name.substring(0, trunkLength - 1) + "...";
    }
  }

function mapStateToProps(state) {
  console.log('STATE', state.viz.views);
  return {
    site: state.viz.site,
    views: state.viz.views,
    viewPath: state.viz.viewPath,
  }
}

export const VizPage = connect(mapStateToProps, actionCreators)(Viz);
