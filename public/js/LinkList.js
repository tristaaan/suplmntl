//LinkList
var React = require('react'),
  ajax = require('jquery').ajax,
  LinksBox = require('./LinkBox'),
  AddLinkForm = require('./AddLinkForm');

import {RouteHandler} from 'react-router';

export default React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState() {
    return {links: [], title: ''};
  },
  componentDidMount(){
    var id = this.context.router.getCurrentParams().id;
    ajax({
      url: '/api/collection',
      dataType: 'json',
      type: 'GET',
      data: {id: id},
      success: function(data) {
        this.setState({id: id, title: data.title, links: data.links});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(err.toString());
      }.bind(this)
    });
  },
  handleSubmit(newLink) {
    var id = this.state.id;
    ajax({
      url: '/api/link',
      dataType: 'json',
      type: 'PUT',
      data: {id: id, item: newLink},
      error: function(xhr, status, err) {
        console.error(err.toString());
      }.bind(this)
    });
    var nextLinks = this.state.links.concat([newLink]);
    this.setState({links: nextLinks});
  },
  handleUpdate(index) {
    var id = this.state.id;
    ajax({
      url: '/api/collection',
      dataType: 'json',
      type: 'POST',
      data: {id: id},
      error: function(xhr, status, err) {
        console.error(err.toString());
      }.bind(this)
    });
    var newLinks = this.state.links;
    newLinks.splice(index, 1);
    this.setState({links: newLinks});
  },
  handleDelete(index) {
    var id = this.state.id;
    ajax({
      url: '/api/link',
      dataType: 'json',
      type: 'DELETE',
      data: {colId: id, index: index},
      error: function(xhr, status, err) {
        console.error(err.toString());
      }.bind(this)
    });
    var newLinks = this.state.links;
    newLinks.splice(index, 1);
    this.setState({links: newLinks});
  },
  render() {
    return (
      <section id="linkList">
        <RouteHandler/>
        <h1>{this.state.title}</h1>
        <LinksBox links={this.state.links} deleteItem={this.handleDelete} />
        <AddLinkForm onLinkSubmit={this.handleSubmit} />
      </section>
    );
  }
});