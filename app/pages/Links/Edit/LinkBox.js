//LinkBox
import React from 'react';

export default React.createClass({
	deleteItem(e) {
    if (confirm('Are you sure you want to remove this item?')){
      this.props.deleteItem(e.target.value);
    }
  },
  render() {
    var createItem = function(item, index) {
      return (
        <div className="linkItem" key={index}>
          <dt>
            <a href={item.link} target="_blank">{item.title}</a>
            <button onClick={this.deleteItem} value={index}>x</button>
          </dt>
          <dd>
            <p>{item.description}</p>
          </dd>
        </div>
      );
    };
    return <dl>{this.props.links.map(createItem, this)}</dl>;
  }
});