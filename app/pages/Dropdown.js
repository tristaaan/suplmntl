import React from 'react';
import PropTypes from 'prop-types';

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.el = React.createRef();
    this.state = { toggled: false };

    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidUpdate() {
    if (this.state.toggled) {
      window.addEventListener('click', this.handleClickOutside);
      window.addEventListener('touchend', this.handleClickOutside);
    } else {
      window.removeEventListener('click', this.handleClickOutside);
      window.removeEventListener('touchend', this.handleClickOutside);
    }
  }

  componentWillUnmount() {
    if (this.state.toggled) {
      window.removeEventListener('click', this.handleClickOutside);
      window.removeEventListener('touchend', this.handleClickOutside);
    }
  }

  handleClickOutside(e) {
    const children = this.el.current.getElementsByTagName('*');
    // if the click was in this element, ignore it.
    for (let i = 0; i < children.length; i += 1) {
      if (e.target === children[i]) {
        return;
      }
    }
    // otherwise toggle
    this.toggle();
  }

  toggle() {
    const { toggled } = this.state;
    this.setState({ toggled: !toggled });
  }

  render() {
    const isHidden = !this.state.toggled ? 'hidden' : '';
    return (
      <div className="dropdown" ref={this.el}>
        <button type="button" className="dropdown-button" onClick={() => this.toggle()}>
          {this.props.buttonText}
        </button>
        <section className={[isHidden, 'dropdown-content'].join(' ')}>
          {this.props.children}
        </section>
      </div>
    );
  }
}

Dropdown.propTypes = {
  buttonText: PropTypes.string,
  children: PropTypes.object
};

export default Dropdown;
