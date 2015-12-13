var React = require('react'),
  ReactDOM = require('react-dom');

export default React.createClass({
  getInitialState() {
    return {toggled: false};
  },
  componentDidUpdate(prevState) {
    if(this.state.toggled) {
      window.addEventListener('click', this.handleClickOutside);
    } else if(!this.state.toggled) {
      window.removeEventListener('click', this.handleClickOutside);
    }   
  },
  componentWillUnmount() {
    if(this.state.toggled) {
      window.removeEventListener('click', this.handleClickOutside);
    }
  },
  handleClickOutside(e) {
    var children = ReactDOM.findDOMNode(this).getElementsByTagName('*');
    for(var x in children) {
      if(children[x] == e.target) { 
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
    this.setState({toggled: toggleValue});
  },
  render() {
    var isHidden = !this.state.toggled ? 'hidden' : '';
    return (
      <div className="dropdown">
        <button ref="dropdownButton" className="dropdown-button" onClick={this.toggle}>{this.props.buttonText}</button>
        <section ref="dropdownContent" className={isHidden + ' dropdown-content'}>{this.props.children}</section>
      </div>
    );
  }
});