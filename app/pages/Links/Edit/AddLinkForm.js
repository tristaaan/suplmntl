import React from 'react';
import PropTypes from 'prop-types';

class AddLinkForm extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = { title: '', link: '', description: '' };
    this.state = { ...this.initialState };

    this.submitButton = React.createRef();
    this.titleInput = React.createRef();
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
    this.setState({ ...this.initialState });
    this.submitButton.current.blur();
    this.titleInput.current.focus();
  }

  updateStateFromForm(e) {
    const { key } = e.target.dataset;
    const modState = {};

    modState[key] = e.target.value;
    this.setState(modState);
  }

  render() {
    const { title, link, description } = this.state;
    return (
      <form onSubmit={(e) => this.handleSubmit(e)} className="linkForm">
        <input
          type="text"
          placeholder="title"
          ref={this.titleInput}
          data-key="title"
          onChange={(e) => this.updateStateFromForm(e)}
          value={title}
          required />
        <input
          type="text"
          placeholder="url"
          data-key="link"
          onChange={(e) => this.updateStateFromForm(e)}
          value={link}
          required />
        <textarea
          placeholder="description"
          data-key="description"
          onChange={(e) => this.updateStateFromForm(e)}
          value={description}
          required />
        <button
          type="submit"
          className="addItemButton"
          ref={this.submitButton}>
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
