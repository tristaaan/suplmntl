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
    console.log(this.props.collections);
    const createItem = (col, index) => {
      return (
        <li key={`${col.id}_${index}`}>
          <Link to={`/list/${col.id}/view`} className="title">{col.name}</Link>
          <span>{col.items.length === 1 ? `${col.items.length} link` : `${col.items.length} links`}</span>
        </li>
      );
    };
    return (<ul>{this.props.collections.map(createItem)}</ul>);
  }
});

// <button onClick={this.deleteItem} value={index}>x</button>
