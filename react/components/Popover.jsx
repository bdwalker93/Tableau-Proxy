import { Popover, OverlayTrigger } from 'react-bootstrap';
import React from 'react';

const MyPopover = React.createClass({
  render: function() {
    const childrenWithProps = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        onClick: ()=> document.body.click()
      })
    });

    return <OverlayTrigger trigger="click" rootClose
      placement="bottom" overlay={<Popover id={this.props.id}>
        {childrenWithProps}
      </Popover>}>
      {this.props.trigger}
    </OverlayTrigger>
  }
});

export default MyPopover;
