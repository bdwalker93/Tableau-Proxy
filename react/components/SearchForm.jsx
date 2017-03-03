import React from 'react';
import { FormGroup, FormControl } from 'react-bootstrap';

export const SearchForm = React.createClass({
  getInitialState() {
    return { value: '' }
  },
  handleChange(e) {
    const { tab, sortId, orderId } = this.props;
    this.setState({ value: e.target.value });
    this.props.search(e.target.value, tab, sortId, orderId);
  },
  render() {
    return (
      <form onSubmit={e=>e.preventDefault()}>
        <FormGroup controlId="formBasicText" style={{margin:0}}>
          <FormControl
            type="text"
            value={this.state.value}
            placeholder="Search"
            onChange={this.handleChange}
          />
        </FormGroup>
      </form>
    );
  }
});

export default SearchForm;
