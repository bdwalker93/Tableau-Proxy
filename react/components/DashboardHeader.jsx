import React from 'react';
import { Link } from 'react-router'
import { FormGroup, FormControl, Button, Popover, OverlayTrigger } from 'react-bootstrap';

import './DashboardHeader.less';

const SearchForm = React.createClass({
  getInitialState() {
    return { value: '' }
  },
  handleChange(e) {
    this.setState({ value: e.target.value });
    this.props.search(e.target.value, this.props.tab);
  },
  render() {
    return (
      <form>
        <FormGroup
          controlId="formBasicText"
        >
          <FormControl
            type="text"
            value={this.state.value}
            placeholder="Enter text"
            onChange={this.handleChange}
          />
        </FormGroup>
      </form>
    );
  }
});

export const DashboardHeader = ({
  tab,
  logout, 
  currentSite,
  sites,
  switchSite,
  search,
  total
}) => {
  return <div className="dashboard-header">
    <div>
      <OverlayTrigger trigger="click" rootClose
        placement="bottom" overlay={<Popover id="site-switcher">
          {sites.map(site=><div key={site.urlName}>
            <a href="#" onClick={()=>switchSite(site.urlName, tab)}>{site.name}</a>
          { currentSite.urlName === site.urlName ? 
              <i className="fa fa-check" aria-hidden="true"></i>
              : null 
          }
        </div>)}
        </Popover>}>
        <Button>sites</Button>
      </OverlayTrigger>
      <Button onClick={logout}>Logout</Button>
    </div>
    <div>
      <SearchForm search={search} tab={tab} />
    </div>
  </div>
}
