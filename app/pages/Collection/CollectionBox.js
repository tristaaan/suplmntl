// Collection Box
import React from 'react';
import { Link } from 'react-router';

export default React.createClass({
  propTypes: {
    collections: React.PropTypes.array,
    deleteItem: React.PropTypes.func,
  },
  getDefaultProps() {
    return { collections: [] };
  },
  deleteItem(e) {
    this.props.deleteItem(e.target.value);
  },
  render() {
    const createItem = (col, index) => {
      return (
        <li key={`${col.postId}_${index}`}>
          <Link to={`/list/${col.postId}/view`} className="title">{col.name}</Link>
          <span>{col.links.length === 1 ? `${col.links.length} link` : `${col.links.length} links`}</span>
        </li>
      );
    };
    return (<ul>{this.props.collections.map(createItem)}</ul>);
  }
});

// <button onClick={this.deleteItem} value={index}>x</button>
