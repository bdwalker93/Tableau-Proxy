import React from 'react';

export const Page = React.createClass({
  render: function() {
    const { renderToolbar, children } = this.props;
    return <div style={{backgroundColor: '#f9f9f9', height: '100vh'}}>
      <div style={{width: '100%', height: '50px', backgroundColor: 'white', borderBottom: '1px solid #eee', color: '#2f2f2f'}}>

        {renderToolbar ? renderToolbar() : null}
      </div>
      {children}
    </div>
  }
});

export default Page;
