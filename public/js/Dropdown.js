var React = require('react');

export default React.createClass({
  getInitialState() {
    return {toggled: false};
  },
  componentDidUpdate(prevState) {
      if(this.state.toggled && !prevState.toggled) {
        window.addEventListener('click', this.handleClickOutside);
      } else if(!this.state.toggled && prevState.toggled) {
        window.removeEventListener('click', this.handleClickOutside);
      }   
    },
  handleClickOutside(e) {
    var children = this.getDOMNode().getElementsByTagName('*');
    for(var x in children) {
      if(children[x] == e.target) { 
        return; 
      }
    }
    this.toggle();
  },
  toggle(e) {
    this.setState({toggled: !this.state.toggled})
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