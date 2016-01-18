var React = require('react'),
  ReactDOM = require('react-dom'),
  ajax = require('jquery').ajax;

export default React.createClass({
  getInitialState() {
    return {title: '', link:'', description: ''};
  },
  handleSubmit(e) {
    e.preventDefault();

    if (!this.state.title) {
      console.log('there is no value for title');
      return;
    }
    else if (!this.state.link) {
      console.log('there is no value for link');
      return;
    }
    else if (!this.state.description) {
      console.log('there is no value for description');
      return;
    }

    this.props.onLinkSubmit(this.state);
    this.setState(this.getInitialState());
    this.refs.submitButton.blur();
    this.refs.titleInput.focus();
  },
  updateStateFromForm(e) {
    var key = e.target.dataset.key,
      newState = {};

    newState[key] = e.target.value;
    this.setState(newState);
  },
  // fetchTitle(e) {
  //   var link = e.target.value;
  //   if (link.length == 0){
  //     this.setState({link: ''});
  //     return;
  //   }
  //   this.setState({title: link});
  //   ajax({
  //     url: '/api/title',
  //     dataType: 'json',
  //     type: 'PUT',
  //     data: {url: link}, //problem here?
  //     success: function(data) {
  //       this.setState({title: data.title, link:link});
  //     }.bind(this),
  //     error: function(xhr, status, err) {
  //       console.error(err.toString());
  //     }.bind(this)
  //   });
  // },
  render() {
    return (
      <form onSubmit={this.handleSubmit} className="linkForm">
        <input type="text" placeholder="title" 
          ref="titleInput" 
          data-key="title"
          onChange={this.updateStateFromForm} 
          value={this.state.title}
          autofocus required/>
        <input type="text" placeholder="url" 
          data-key="link" 
          onChange={this.updateStateFromForm}
          value={this.state.link}
          required /> 
        <textarea placeholder="description" 
          data-key="description"
          onChange={this.updateStateFromForm} 
          value={this.state.description}
          required/>
        <button ref="submitButton">Save</button>
      </form>
    );
  }
});