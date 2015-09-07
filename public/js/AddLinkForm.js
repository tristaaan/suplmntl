//AddLinkForm
var React = require('react'),
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
    this.refs.submitButton.getDOMNode().blur();
    this.refs.titleInput.getDOMNode().focus();
  },
  //in larger forms avoid having an update function for everything.
  updateTitle(e) {
    var newState = {title: e.target.value};
    if (e.target.value === '') {
      newState['link'] = '';
    }
    this.setState(newState);
  },
  updateDescription(e) {
    this.setState({description: e.target.value});
  },  
  fetchTitle(e) {
    var link = e.target.value;
    if (link.length == 0){
      this.setState({link: ''});
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
      <form onSubmit={this.handleSubmit} className="linkForm">
        <input type="text" name="title" placeholder="link" 
          ref="titleInput"
          onChange={this.updateTitle} 
          onBlur={this.fetchTitle} 
          value={this.state.title}
          autofocus/>
        <textarea name="description" placeholder="description" onChange={this.updateDescription} value={this.state.description}/>
        <button ref="submitButton">Save</button>
      </form>
    );
  }
});