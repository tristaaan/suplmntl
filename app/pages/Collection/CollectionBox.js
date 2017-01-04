//Collection Box
import React from 'react';
import {Link} from 'react-router';

export default React.createClass({
  getDefaultProps() {
    return { links: [] };
  },
  deleteItem(e) {
    this.props.deleteItem(e.target.value);
  },
  render() {
    var createItem = function(item, index) {
      return (
        <li key={`${item.id}_${index}`}>
          <Link to={`/list/${item.id}/view`} className="title">{item.name}</Link>
          <span>{item.size === 1 ? item.size + ' link' : item.size + ' links'}</span>
        </li>
      );
    };
    return (<ul>{this.props.links.map(createItem)}</ul>);
  }
});

// <button onClick={this.deleteItem} value={index}>x</button>