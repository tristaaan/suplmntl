// AddCollectionForm
import React from 'react';
import PropTypes from 'prop-types';

class AddCollectionForm extends React.Component {
  constructor(props) {
    super(props);
    this.nameInput = React.createRef();
    this.state = { name: '' };
  }

  componentDidMount() {
    this.nameInput.current.focus();
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
      <form className="collectionForm" onSubmit={(e) => this.handleSubmit(e)}>
        <input
          onChange={(e) => this.handleChange(e)}
          value={this.state.name}
          ref={this.nameInput} />
        <button type="submit">+</button>
        <button type="button" onClick={() => this.props.toggler()}>x</button>
      </form>
    );
  }
}

AddCollectionForm.propTypes = {
  toggler: PropTypes.func,
  onLinkSubmit: PropTypes.func,
};

export default AddCollectionForm;
