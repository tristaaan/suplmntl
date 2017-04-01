import React from 'react';

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
      window.addEventListener('touchend', this.handleClickOutside);
    } else if (!this.state.toggled) {
      window.removeEventListener('click', this.handleClickOutside);
      window.removeEventListener('touchend', this.handleClickOutside);
    }
  },

  componentWillUnmount() {
    if (this.state.toggled) {
      window.removeEventListener('click', this.handleClickOutside);
      window.removeEventListener('touchend', this.handleClickOutside);
    }
  },

  handleClickOutside(e) {
    const children = this.el.getElementsByTagName('*');
    for (let i = 0; i < children.length; i += 1) {
      if (children[i] === e.target) {
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
      <div className="dropdown" ref={(c) => {this.el = c;}}>
        <button className="dropdown-button" onClick={this.toggle}>{this.props.buttonText}</button>
        <section className={[isHidden, 'dropdown-content'].join(' ')}>{this.props.children}</section>
      </div>
    );
  }
});
