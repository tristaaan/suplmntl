import React from 'react';
import Header from './Header';

export default React.createClass({
  propTypes: {
    children: React.PropTypes.object,
  },

  render() {
    return (
      <div>
        <Header />
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
});
