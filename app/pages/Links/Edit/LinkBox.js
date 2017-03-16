// LinkBox
import React from 'react';

export default React.createClass({
  propTypes: {
    links: React.PropTypes.array,
    deleteItem: React.PropTypes.func,
    onChange: React.PropTypes.func,
  },

  onItemChange(e) {
    const index = parseInt(e.target.parentElement.dataset.index, 10);
    const key = e.target.dataset.key;
    const value = e.target.value;
    this.props.onChange(index, key, value);
  },

  deleteItem(e) {
    if (confirm('Are you sure you want to remove this item?')) {
      this.props.deleteItem(e.target.value);
    }
  },

  createItem(item, index) {
    return (
      <div className="editLinkItem" key={index} data-index={index}>
        <div className="titleRow" data-index={index}>
          <input type="text" placeholder="title"
            data-key="title"
            onChange={this.onItemChange}
            value={item.title} />
          <button className="errorButton"
            onClick={this.deleteItem} value={index}>x</button>
        </div>
        <input type="text" placeholder="url"
          data-key="link"
          onChange={this.onItemChange}
          value={item.link} />
        <textarea placeholder="description"
          data-key="description"
          onChange={this.onItemChange}
          value={item.description} />
      </div>
    );
  },

  render() {
    return <dl>{this.props.links.map(this.createItem)}</dl>;
  }
});
