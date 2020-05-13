// Collection Box
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class CollectionBox extends React.Component {
  deleteItem(e) {
    this.props.deleteItem(e.target.value);
  }

  render() {
    const createItem = (col, index) => {
      const date = new Date(col.createdAt);
      return (
        <div key={`${col.postId}_${index}`} className="collection-item">
          <Link to={`/${this.props.username}/${col.postId}/view`} className="title">{col.name}</Link>
          <div className="meta">
            <span>{`Created: ${date.getFullYear()}/${date.getMonth()}/${date.getDay()} at ${date.getHours()}:${date.getMinutes()}`}</span>
            <span>{col.links.length === 1 ? `${col.links.length} link` : `${col.links.length} links`}</span>
          </div>
        </div>
      );
    };
    return (
      <div className="collection-container">
        {this.props.collections.map(createItem)}
      </div>
    );
  }
}

CollectionBox.propTypes = {
  username: PropTypes.string,
  collections: PropTypes.array,
  deleteItem: PropTypes.func,
};

CollectionBox.defaultProps = { collections: [] };

export default CollectionBox;
