// LinkBox
import React from 'react';
import PropTypes from 'prop-types';

// function isImage(link) {
//   return /.*(\.png$|\.jpg$|\.gif$)/.test(link);
// }

function LinkBox({ links }) {
  if (!links || !links.length) {
    return (<p>There are no links in this collection</p>);
  }

  const createItem = (item, index) => (
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
  return <dl>{links.map(createItem)}</dl>;
}

LinkBox.propTypes = {
  links: PropTypes.array,
};

export default LinkBox;
