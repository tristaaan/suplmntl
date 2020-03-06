// LinkBox
import React from 'react';
import PropTypes from 'prop-types';

function LinkBox(props) {
  const onItemChange = (e) => {
    const index = parseInt(e.target.parentElement.dataset.index, 10);
    const { key } = e.target.dataset;
    const { value } = e.target;
    props.onChange(index, key, value);
  };

  const deleteItem = (e) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      props.deleteItem(e.target.value);
    }
  };

  const moveUp = (e) => {
    const index = parseInt(e.target.parentElement.dataset.index, 10);
    props.moveUp(index);
  };

  const moveDown = (e) => {
    const index = parseInt(e.target.parentElement.dataset.index, 10);
    props.moveDown(index);
  };

  const size = props.links.length;

  const createItem = (item, index) => (
    <div className="editLinkItem" key={index} data-index={index}>
      <div className="titleRow" data-index={index}>
        <input
          type="text"
          placeholder="title"
          data-key="title"
          onChange={onItemChange}
          value={item.title} />
        { index === 0
          ? null
          : (
            <button
              type="button"
              className="linkListHandle"
              onClick={moveUp}
            >
              &#8593;
            </button>
          )}
        { index === size - 1
          ? null
          : (
            <button
              type="button"
              className="linkListHandle"
              onClick={moveDown}
            >
              &#8595;
            </button>
          )}
        <button
          className="errorButton"
          type="button"
          onClick={deleteItem}
          value={index}>
          &times;
        </button>
      </div>
      <input
        type="text"
        placeholder="url"
        data-key="link"
        onChange={onItemChange}
        value={item.link} />
      <textarea
        placeholder="description"
        data-key="description"
        onChange={onItemChange}
        value={item.description} />
    </div>
  );

  return <dl>{props.links.map(createItem)}</dl>;
}

LinkBox.propTypes = {
  links: PropTypes.array,
  deleteItem: PropTypes.func,
  onChange: PropTypes.func,
  moveUp: PropTypes.func,
  moveDown: PropTypes.func
};

export default LinkBox;
