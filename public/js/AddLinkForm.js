//AddLinkForm
var React = require('react'),
  ajax = require('jquery').ajax;

export default React.createClass({
  getInitialState() {
    return {title: '', link:'', description: ''};
  },
  handleSubmit(e) {
    e.preventDefault();

    if (!this.state.title || !this.state.link || !this.state.description) {
      return;
    }

    this.props.onLinkSubmit(this.state);
    this.setState(this.getInitialState());
    this.refs.submitButton.getDOMNode().blur();
    this.refs.titleInput.getDOMNode().focus();
  },
  //in larger forms avoid having an update function for everything.
  updateTitle(e) {
    this.setState({title: e.target.value});
  },
  updateDescription(e) {
    this.setState({description: e.target.value});
  },  
  fetchTitle(e) {
    var link = e.target.value;
    if (link.length == 0){
      return;
    }
    this.setState({title: link});
    ajax({
      url: '/api/title',
      dataType: 'json',
      type: 'PUT',
      data: {url: link}, //problem here?
      success: function(data) {
        this.setState({title: data.title, link:link});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(err.toString());
      }.bind(this)
    });
  },
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" name="title" placeholder="link" 
          ref="titleInput"
          onBlur={this.fetchTitle} 
          onChange={this.updateTitle} 
          value={this.state.title}
          autofocus/>
        <textarea name="description" placeholder="description" onChange={this.updateDescription} value={this.state.description}/>
        <button ref="submitButton">Save</button>
      </form>
    );
  }
});