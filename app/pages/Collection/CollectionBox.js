// Collection Box
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import fullTime from '../../utils/fullTime';

class CollectionBox extends React.Component {
  deleteItem(e) {
    this.props.deleteItem(e.target.value);
  }

  render() {
    const createItem = (col, index) => {
      const cDate = new Date(col.createdAt);
      const mDate = col.updatedAt ? new Date(col.updatedAt) : cDate;
      return (
        <div key={`${col.postId}_${index}`} className="collection-item">
          <div className="head">
            <span><Link to={`/${this.props.username}/${col.postId}/view`} className="title">{col.name}</Link></span>
            <span>{col.links.length === 1 ? `${col.links.length} link` : `${col.links.length} links`}</span>
          </div>
          <div className="meta-container">
            <div className="meta">
              <span>{`Created: ${fullTime(cDate)}`}</span>
              <span>{ col.private ? '(private)' : ''}</span>
            </div>
            <div className="meta">
              <span>{`Modified: ${fullTime(mDate)}`}</span>
              <span>{ col.forkOf !== null ? '(fork)' : ''}</span>
            </div>
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
