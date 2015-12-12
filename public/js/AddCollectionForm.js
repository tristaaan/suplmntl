//AddCollectionForm
var React = require('react'),
  ReactDOM = require('react-dom');

export default React.createClass({
  getInitialState() {
    return {title:''};
  },
  componentDidMount() {
    this.refs.titleInput.focus(); 
  },
  handleChange(e) {
    this.setState({title: e.target.value});
  },
  handleSubmit(e) {
    if (!/\S/.test(this.state.title)){
      return;
    }
    this.props.onLinkSubmit(this.state);
    this.props.toggler();
  },
  render() {
    return (
      <form className="collectionForm" onSubmit={this.handleSubmit}>
        <input onChange={this.handleChange} value={this.state.title} ref="titleInput"/>
        <button>+</button>
        <button onClick={this.props.toggler}>x</button>
      </form>
    );
  }
});