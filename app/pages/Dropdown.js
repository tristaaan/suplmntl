import React from 'react';
import ReactDOM from 'react-dom';

export default React.createClass({
  propTypes: {
    buttonText: React.PropTypes.string,
    children: React.PropTypes.object
  },

  getInitialState() {
    return { toggled: false };
  },

  componentDidUpdate(prevState) {
    if (this.state.toggled) {
      window.addEventListener('click', this.handleClickOutside);
    } else if (!this.state.toggled) {
      window.removeEventListener('click', this.handleClickOutside);
    }
  },

  componentWillUnmount() {
    if (this.state.toggled) {
      window.removeEventListener('click', this.handleClickOutside);
    }
  },

  handleClickOutside(e) {
    const children = ReactDOM.findDOMNode(this).getElementsByTagName('*');
    for (let x in children) {
      if (children[x] === e.target) {
        return;
      }
    }
    this.toggle();
  },

  toggle(newVal) {
    var toggleValue = !this.state.toggled;
    if (newVal === undefined) {
      toggleValue = newVal;
    }
    this.setState({ toggled: toggleValue });
  },

  render() {
    var isHidden = !this.state.toggled ? 'hidden' : '';
    return (
      <div className="dropdown">
        <button className="dropdown-button" onClick={this.toggle}>{this.props.buttonText}</button>
        <section className={[isHidden, 'dropdown-content'].join(' ')}>{this.props.children}</section>
      </div>
    );
  }
});
