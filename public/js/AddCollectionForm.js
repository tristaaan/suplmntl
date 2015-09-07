//AddCollectionForm
var React = require('react');

export default React.createClass({
  getInitialState() {
    return {id: this.genId(), title:''};
  },
  componentDidMount() {
    this.refs.titleInput.getDOMNode().focus(); 
  },
  genId() {
    return Math.floor(Math.random()*0xaabbcc);
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