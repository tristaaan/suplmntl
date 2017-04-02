// LinkBox
import React from 'react';

// function isImage(link) {
//   return /.*(\.png$|\.jpg$|\.gif$)/.test(link);
// }

export default React.createClass({
  propTypes: {
    links: React.PropTypes.array,
  },

  render() {
    if (!this.props.links || !this.props.links.length) {
      return (<p>There are no links in this collection</p>);
    }

    const createItem = (item, index) => {
      return (
        <div className="linkItem" key={index}>
          <dt>
            <a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a>
          </dt>
          <dd>
            {/* {isImage(item.link) ? <img src={item.link} /> : null} */ }
            <p>{item.description}</p>
          </dd>
        </div>
      );
    };
    return <dl>{this.props.links.map(createItem)}</dl>;
  }
});
