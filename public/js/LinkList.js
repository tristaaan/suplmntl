//LinkList
var React = require('react'),
  Navigation = require('react-router').Navigation,
  ajax = require('jquery').ajax,
  Dropdown = require('./Dropdown'),
  LinksBox = require('./LinkBox'),
  AddLinkForm = require('./AddLinkForm');

import {RouteHandler} from 'react-router';

export default React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  mixins: [Navigation],
  getInitialState() {
    return {links: [], title: '', tmpTitle: '', renaming: false};
  },
  componentDidMount(){
    var id = this.context.router.getCurrentParams().id;
    ajax({
      url: '/api/collection',
      dataType: 'json',
      type: 'GET',
      data: {id: id},
      success: function(data) {
        this.setState({id: id, title: data.title, tmpTitle: data.title, links: data.links});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(err.toString());
      }.bind(this)
    });
  },
  componentDidUpdate(prevState) {
    if (this.state.renaming) {
      this.getDOMNode().addEventListener('keyup', this.keyPressed);
      this.refs.titleEditor.getDOMNode().focus();
    }
    else {
      this.getDOMNode().removeEventListener('keyup', this.keyPressed);
    }
  },
  componentWillUnmount() {
    if (this.state.renaming) {
      this.getDOMNode().removeEventListener('keyup', this.keyPressed);
    }
  },
  handleSubmit(newLink) {
    var id = this.state.id;
    ajax({
      url: '/api/link',
      dataType: 'json',
      type: 'PUT',
      data: {id: id, item: newLink},
      success: function(data) {
        var nextLinks = this.state.links.concat([newLink]);
        this.setState({links: nextLinks});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(err.toString());
      }.bind(this)
    });
  },
  handleUpdate(index) {
    var id = this.state.id;
    ajax({
      url: '/api/collection',
      dataType: 'json',
      type: 'POST',
      data: {id: id},
      success: function(data) {
        var newLinks = this.state.links;
        newLinks.splice(index, 1);
        this.setState({links: newLinks});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(err.toString());
      }.bind(this)
    });
  },
  handleDelete(index) {
    var id = this.state.id;
    ajax({
      url: '/api/link',
      dataType: 'json',
      type: 'DELETE',
      data: {colId: id, index: index},
      success: function(data){
        var newLinks = this.state.links;
        newLinks.splice(index, 1);
        this.setState({links: newLinks});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(err.toString());
      }.bind(this)
    });
  },
  deleteList() {
    if(!confirm('Are you sure you want to delete "'+this.state.title+'"?')){
      return;
    }
    var id = this.state.id;
    ajax({
      url: '/api/collection',
      dataType: 'json',
      type: 'DELETE',
      data: {id: id},
      complete: function(){ //run this regardless if success or error
        this.goBack();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(err.toString());
      }.bind(this)
    });
  },
  keyPressed(e) {
    if (e.keyCode === 27) {
      this.setState({renaming: false});
      this.refs.dropdown.toggle(false);
    }
    else if (e.keyCode == 13) {
      this.setState({renaming: false, title: this.state.tmpTitle});
      ajax({
        url: '/api/collection',
        dataType: 'json',
        type: 'POST',
        data: {id: this.state.id, title: this.state.tmpTitle},
        error: function(xhr, status, err) {
          console.error(err.toString());
        }.bind(this)
      });
      this.refs.dropdown.toggle(false);
    }
  },
  renameList() {
    this.setState({renaming: true});
    this.refs.dropdown.toggle(false);
  },
  updateTmpTitle(e) {
    this.setState({tmpTitle: e.target.value});
  },
  render() {
    return (
      <section id="linkList">
        <RouteHandler/>
        <div className="linkListHeader">
          { this.state.renaming ? 
            <input ref="titleEditor" onChange={this.updateTmpTitle} value={this.state.tmpTitle}></input> 
            : <h1>{this.state.title}</h1>}
          <Dropdown ref="dropdown" buttonText="#">
            <ul className="dropdown-list">
              <li onClick={this.renameList}>Rename list</li>
              <li onClick={this.deleteList}>Delete list</li>
            </ul>
          </Dropdown>
        </div>
        <LinksBox links={this.state.links} deleteItem={this.handleDelete} />
        <AddLinkForm onLinkSubmit={this.handleSubmit} />
      </section>
    );
  }
});