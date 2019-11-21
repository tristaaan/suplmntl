import React from 'react';
import PropTypes from 'prop-types';

class AddLinkForm extends React.component {
  getInitialState() {
    return { title: '', link: '', description: '' };
  }

  handleSubmit(e) {
    e.preventDefault();

    let { title, link, description } = this.state;
    title = title.trim();
    link = link.trim();
    description = description.trim();

    if (!title) {
      console.log('there is no value for title');
      return;
    }

    if (!link) {
      console.log('there is no value for link');
      return;
    }

    if (!description) {
      console.log('there is no value for description');
      return;
    }

    if (link.substring(0, 8).toLowerCase() !== 'https://'
      && link.substring(0, 7).toLowerCase() !== 'http://') {
      link = `https://${link}`;
    }

    this.props.onLinkSubmit({ title, link, description });
    this.setState(this.getInitialState());
    this.submitButton.blur();
    this.titleInput.focus();
  }

  updateStateFromForm(e) {
    var { key } = e.target.dataset,
      modState = {};

    modState[key] = e.target.value;
    this.setState(modState);
  }

  render() {
    const { title, link, description } = this.state;
    return (
      <form onSubmit={this.handleSubmit} className="linkForm">
        <input type="text"
          placeholder="title"
          ref={(c) => { this.titleInput = c; }}
          data-key="title"
          onChange={this.updateStateFromForm}
          value={title}
          required />
        <input type="text"
          placeholder="url"
          data-key="link"
          onChange={this.updateStateFromForm}
          value={link}
          required />
        <textarea placeholder="description"
          data-key="description"
          onChange={this.updateStateFromForm}
          value={description}
          required />
        <button
          type="submit"
          className="addItemButton"
          ref={(c) => { this.submitButton = c; }}>
          Add Link
        </button>
      </form>
    );
  }
}

AddLinkForm.propTypes = {
  onLinkSubmit: PropTypes.func,
};

export default AddLinkForm;
