import React from 'react';
import { Link } from 'react-router'
import { FormGroup, FormControl, Button, Popover, OverlayTrigger } from 'react-bootstrap';

const SearchForm = React.createClass({
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
        <FormGroup controlId="formBasicText">
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
  currentSite,
  sites,
  switchSite,
  search,
  total,
  sortId,
  sortOptions,
  orderId,
  orderOptions,
}) => {
  return <div className="dashboard-header">
    <div>

      <OverlayTrigger trigger="click" rootClose
        placement="bottom" overlay={<Popover id="sort-option">
          {sortOptions.map(sort=><div key={sort.id}>
            <Link to={`/app/workbooks/${tab}/${sort.id}/${orderId}`}>{sort.label}</Link>
          { sortId === sort.id ? 
              <i className="fa fa-check" aria-hidden="true"></i>
              : null 
          }
        </div>)}
        <hr/>
        {orderOptions.map(order=><div key={order.id}>
          <Link to={`/app/workbooks/${tab}/${sortId}/${order.id}`}>{order.label}</Link>
          { orderId === order.id ? 
              <i className="fa fa-check" aria-hidden="true"></i>
              : null 
          }
        </div>)}
        </Popover>}>
        <Button>sort</Button>
      </OverlayTrigger>

    </div>
    <div>
      <SearchForm search={search} tab={tab} />
    </div>
  </div>
}
