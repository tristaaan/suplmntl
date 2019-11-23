// LinkBox
import React from 'react';
import PropTypes from 'prop-types';

class LinkBox extends React.Component {
  onItemChange(e) {
    const index = parseInt(e.target.parentElement.dataset.index, 10);
    const { key } = e.target.dataset;
    const { value } = e.target;
    this.props.onChange(index, key, value);
  }

  deleteItem(e) {
    if (window.confirm('Are you sure you want to remove this item?')) {
      this.props.deleteItem(e.target.value);
    }
  }

  createItem(item, index) {
    return (
      <div className="editLinkItem" key={index} data-index={index}>
        <div className="titleRow" data-index={index}>
          <input
            type="text"
            placeholder="title"
            data-key="title"
            onChange={(e) => this.onItemChange(e)}
            value={item.title} />
          <button
            className="errorButton"
            type="button"
            onClick={(e) => this.deleteItem(e)}
            value={index}>
            x
          </button>
        </div>
        <input
          type="text"
          placeholder="url"
          data-key="link"
          onChange={(e) => this.onItemChange(e)}
          value={item.link} />
        <textarea
          placeholder="description"
          data-key="description"
          onChange={(e) => this.onItemChange(e)}
          value={item.description} />
      </div>
    );
  }

  render() {
    return <dl>{this.props.links.map(this.createItem)}</dl>;
  }
}

LinkBox.propTypes = {
  links: PropTypes.array,
  deleteItem: PropTypes.func,
  onChange: PropTypes.func,
};

export default LinkBox;
