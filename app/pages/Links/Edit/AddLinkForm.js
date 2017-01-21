import React from 'react';

export default React.createClass({
  propTypes: {
    onLinkSubmit: React.PropTypes.func,
  },

  getInitialState() {
    return { title: '', link: '', description: '' };
  },

  handleSubmit(e) {
    e.preventDefault();

    let { title, link, description } = this.state;
    title = title.trim();
    link = link.trim();
    description = description.trim();

    if (!title) {
      console.log('there is no value for title');
      return;
    } else if (!link) {
      console.log('there is no value for link');
      return;
    } else if (!description) {
      console.log('there is no value for description');
      return;
    }

    if (link.substring(0, 8) !== 'https://' && link.substring(0, 7) !== 'http://') {
      link = `https://${link}`;
    }

    this.props.onLinkSubmit({ title, link, description });
    this.setState(this.getInitialState());
    this.submitButton.blur();
    this.titleInput.focus();
  },

  updateStateFromForm(e) {
    var key = e.target.dataset.key,
      newState = {};

    newState[key] = e.target.value;
    this.setState(newState);
  },

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="linkForm">
        <input type="text" placeholder="title"
          ref={(c) => { this.titleInput = c; }}
          data-key="title"
          onChange={this.updateStateFromForm}
          value={this.state.title}
          autoFocus required />
        <input type="text" placeholder="url"
          data-key="link"
          onChange={this.updateStateFromForm}
          value={this.state.link}
          required />
        <textarea placeholder="description"
          data-key="description"
          onChange={this.updateStateFromForm}
          value={this.state.description}
          required />
        <button ref={(c) => { this.submitButton = c; }}>Save</button>
      </form>
    );
  }
});
