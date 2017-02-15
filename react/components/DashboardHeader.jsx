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
  total,
  currentSortOption,
  sortOptions,
  currentOrderOption,
  orderOptions,
  sort
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
      <OverlayTrigger trigger="click" rootClose
        placement="bottom" overlay={<Popover id="sort-option">
          {sortOptions.map(opt=><div key={opt.id}>
            <a href="#" onClick={()=>sort(opt.id, currentOrderOption, tab)}>{opt.label}</a>
          { currentSortOption === opt.id ? 
              <i className="fa fa-check" aria-hidden="true"></i>
              : null 
          }
        </div>)}
        <hr/>
        {orderOptions.map(opt=><div key={opt.id}>
          <a href="#" onClick={()=>sort(currentSortOption, opt.id, tab)}>{opt.label}</a>
          { currentOrderOption === opt.id ? 
              <i className="fa fa-check" aria-hidden="true"></i>
              : null 
          }
        </div>)}
        </Popover>}>
        <Button>sort</Button>
      </OverlayTrigger>
    </div>
  </div>
}
