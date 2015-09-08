//LinkList
var React = require('react'),
  ajax = require('jquery').ajax,
  Dropdown = require('./Dropdown'),
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
      success: function() {
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
  render() {
    return (
      <section id="linkList">
        <RouteHandler/>
        <div className="linkListHeader">
          <h1>{this.state.title}</h1>
          <Dropdown buttonText="#">
            <ul className="dropdown-list">
              <li>Delete list</li>
              <li>Rename list</li>
            </ul>
          </Dropdown>
        </div>
        <LinksBox links={this.state.links} deleteItem={this.handleDelete} />
        <AddLinkForm onLinkSubmit={this.handleSubmit} />
      </section>
    );
  }
});