import React from 'react';
import { FormGroup, FormControl, Button} from 'react-bootstrap';
import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';
import cookies from "browser-cookies";

import { Page } from './Page';

const ServerSelection = React.createClass({
  getInitialState() {
    return { value: cookies.get("PROXY_TARGET") || ""} 
  },
  handleChange(e) {
    this.setState({ value: e.target.value });
    cookies.set("PROXY_TARGET", e.target.value); 
  },
  render() {
    return (
      <Page renderToolbar={()=><div>
          <div style={{textAlign: 'center', fontSize: '22px', lineHeight: '48px'}}>Choose a server</div>
        </div>}>
        <form style={{ margin:'20px'}} onSubmit={this.connect}>
          <div style={{
            height: '30vh',
            backgroundImage: 'url(/img/tableau_sign_in_logo.svg)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}></div>
        <FormGroup controlId="formBasicText" >
          <FormControl
            style={{ marginBottom: '20px' }}
            type="text"
            value={this.state.value}
            placeholder="https://server.name"
            onChange={this.handleChange}
          />
          <Button block style={{
            backgroundColor: '#eb8f50',
            color: '#fff'
          }} onClick={this.connect}>Connect
            <i style={{paddingTop: '.3em', color: '#fff'}} className="fa fa-chevron-right pull-right" aria-hidden="true"></i>
          </Button>
        </FormGroup>
      </form>
    </Page>
    );
  },
  connect(e) {
    e.preventDefault();
    this.props.connectToTableau(this.state.value)
  }
});

function mapStateToProps(state) {
  return {
  }
}

export const ServerSelectionPage = connect(mapStateToProps, actionCreators)(ServerSelection); 
