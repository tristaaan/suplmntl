// AddCollectionForm
import React from 'react';

export default React.createClass({
  propTypes: {
    toggler: React.PropTypes.func,
    onLinkSubmit: React.PropTypes.func,
  },

  getInitialState() {
    return { name: '' };
  },
  componentDidMount() {
    this.nameInput.focus();
  },
  handleChange(e) {
    this.setState({ name: e.target.value });
  },
  handleSubmit(e) {
    e.preventDefault();
    if (!/\S/.test(this.state.name) || this.state.name.length === 0) {
      return;
    }
    this.props.onLinkSubmit(this.state);
    this.props.toggler(e);
  },
  render() {
    return (
      <form className="collectionForm" onSubmit={this.handleSubmit}>
        <input onChange={this.handleChange} value={this.state.name}
          ref={(c) => {this.nameInput = c;} } />
        <button>+</button>
        <button onClick={this.props.toggler}>x</button>
      </form>
    );
  }
});
