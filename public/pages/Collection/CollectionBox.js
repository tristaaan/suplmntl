//Collection Box
var React = require('react');

import {Link} from 'react-router';

export default React.createClass({
  deleteItem(e) {
    this.props.deleteItem(e.target.value);
  },
  render() {
    var createItem = function(item, index) {
      return (
        <li key={item.id}>
          <Link to={`/list/${item.id}/view`} className="title">{item.title}</Link>
          <span>{item.size === 1 ? item.size + ' link' : item.size + ' links'}</span>
        </li>
      );
    };
    return (<ul>{this.props.links.map(createItem, this)}</ul>);
  }
});

// <button onClick={this.deleteItem} value={index}>x</button>