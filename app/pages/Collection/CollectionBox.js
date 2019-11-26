// Collection Box
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class CollectionBox extends React.Component {
  deleteItem(e) {
    this.props.deleteItem(e.target.value);
  }

  render() {
    const createItem = (col, index) => (
      <li key={`${col.postId}_${index}`}>
        <Link to={`/${this.props.username}/${col.postId}/view`} className="title">{col.name}</Link>
        <span>{col.links.length === 1 ? `${col.links.length} link` : `${col.links.length} links`}</span>
      </li>
    );
    return (<ul>{this.props.collections.map(createItem)}</ul>);
  }
}

CollectionBox.propTypes = {
  username: PropTypes.string,
  collections: PropTypes.array,
  deleteItem: PropTypes.func,
};

CollectionBox.defaultProps = { collections: [] };

export default CollectionBox;
