// AddCollectionForm
import React from 'react';
import PropTypes from 'prop-types';

class AddCollectionForm extends React.component {
  getInitialState() {
    return { name: '' };
  }

  componentDidMount() {
    this.nameInput.focus();
  }

  handleChange(e) {
    this.setState({ name: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!/\S/.test(this.state.name) || this.state.name.length === 0) {
      return;
    }
    this.props.onLinkSubmit(this.state);
    this.props.toggler(e);
  }

  render() {
    return (
      <form className="collectionForm" onSubmit={this.handleSubmit}>
        <input onChange={this.handleChange}
          value={this.state.name}
          ref={(c) => {this.nameInput = c;} } />
        <button type="button">+</button>
        <button type="button" onClick={this.props.toggler}>x</button>
      </form>
    );
  }
}

AddCollectionForm.propTypes = {
  toggler: PropTypes.func,
  onLinkSubmit: PropTypes.func,
};

export default AddCollectionForm;
