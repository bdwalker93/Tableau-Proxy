import React from 'react';
import { FormGroup, FormControl, Button} from 'react-bootstrap';
import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';
import cookies from "browser-cookies";

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
      <form>
        <FormGroup controlId="formBasicText" >
          <FormControl
            type="text"
            value={this.state.value}
            placeholder="Enter text"
            onChange={this.handleChange}
          />
          <Button onClick={this.props.connectToTableau}>Connect</Button>
        </FormGroup>
      </form>
    );
  }
});

function mapStateToProps(state) {
  return {
  }
}

export const ServerSelectionPage = connect(mapStateToProps, actionCreators)(ServerSelection); 
