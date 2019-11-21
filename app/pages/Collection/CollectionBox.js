// Collection Box
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

class CollectionBox extends React.component {
  getDefaultProps() {
    return { collections: [] };
  }

  deleteItem(e) {
    this.props.deleteItem(e.target.value);
  }

  render() {
    const createItem = (col, index) => {
      return (
        <li key={`${col.postId}_${index}`}>
          <Link to={`/${this.props.username}/${col.postId}/view`} className="title">{col.name}</Link>
          <span>{col.links.length === 1 ? `${col.links.length} link` : `${col.links.length} links`}</span>
        </li>
      );
    };
    return (<ul>{this.props.collections.map(createItem)}</ul>);
  }
}

CollectionBox.propTypes = {
  username: PropTypes.string,
  collections: PropTypes.array,
  deleteItem: PropTypes.func,
};

export default CollectionBox;
