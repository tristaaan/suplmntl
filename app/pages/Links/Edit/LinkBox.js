// LinkBox
import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    props.moveItem(result.source.index, result.destination.index);
  };

  /* eslint-disable react/jsx-props-no-spreading */
  const createItem = (item, index) => (
    <Draggable
      className="editLinkItem"
      draggableId={`${index}-${item.description.length}`}
      key={index}
      index={index}
      data-index={index}>
      {(provided) => (
        <div
          className="linkListEditBox"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className="titleRow" data-index={index}>
            <input
              type="text"
              placeholder="title"
              data-key="title"
              onChange={onItemChange}
              value={item.title} />
            <button
              className="errorButton"
              type="button"
              onClick={deleteItem}
              value={index}>
              &times;
            </button>
            <div
              className="linkListHandle"
              {...provided.dragHandleProps}
            >
              &#8597;
            </div>
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
      )}
    </Draggable>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div
            className="linkListEditContainer"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {props.links.map(createItem)}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

LinkBox.propTypes = {
  links: PropTypes.array,
  deleteItem: PropTypes.func,
  onChange: PropTypes.func,
  moveItem: PropTypes.func
};

export default LinkBox;
