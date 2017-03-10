import React from 'react';
import { FormGroup, FormControl, Button} from 'react-bootstrap';
import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';
import cookies from "browser-cookies";

import url from "url";

import { Page } from './Page';

const ServerSelection = React.createClass({
  getInitialState() {
    return { value: cookies.get("PROXY_TARGET") || ""} 
  },
  handleChange(e) {
    this.setState({ value: e.target.value });
  },
  render() {
    return (
      <Page renderToolbar={()=><div>
          <div style={{textAlign: 'center', fontSize: '22px', lineHeight: '48px'}}>Choose a server</div>
        </div>}>
        <form style={{ padding: '0 20px' }} onSubmit={this.connect}>
          <div style={{
            height: '30vh',
            backgroundImage: 'url(/img/tableau_sign_in_logo.svg)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}></div>
        <FormGroup style={{padding:'0 20px'}} controlId="formBasicText" >
          <FormControl
            style={{ marginBottom: '20px' }}
            type="text"
            value={this.state.value}
            placeholder="https://server.name"
            onChange={this.handleChange}
          />
          <div>
            <Button block style={{
              backgroundColor: '#eb8f50',
              color: '#fff',
              width: '83%',
              height: '44px',
              margin: '0 auto'
            }} onClick={this.connect}>Connect
            <i style={{paddingTop: '.3em', color: '#fff'}} className="fa fa-chevron-right pull-right" aria-hidden="true"></i>
          </Button>
        </div>
        </FormGroup>
      </form>
    </Page>
    );
  },
  connect(e) {
    e.preventDefault();
    var serverURL = this.state.value;
    var parsedURL = url.parse(serverURL);;

    if(!parsedURL.protocol){
      serverURL = "https://" + serverURL;
      parsedURL = url.parse(serverURL);
    }else if(parsedURL.protocol !== "https"){
      parsedURL.protocol = "https";
    }

    cookies.set("PROXY_TARGET", parsedURL.href); 
    this.props.connectToTableau();
  }
});

function mapStateToProps(state) {
  return {
  }
}

export const ServerSelectionPage = connect(mapStateToProps, actionCreators)(ServerSelection); 
