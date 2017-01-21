// CollectionList
import React from 'react';
import CollectionBox from './CollectionBox';
import AddCollectionForm from './AddCollectionForm';
import * as Actions from '../../redux/actions/collections';

import { connect } from 'react-redux';

const Collections = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    collections: React.PropTypes.array,
    getCollections: React.PropTypes.func,
    addCollection: React.PropTypes.func,
    params: React.PropTypes.object,
  },

  getDefaultProps() {
    return { collections: [] };
  },

  getInitialState() {
    return { colFormVisible: false };
  },

  componentDidMount() {
    this.props.getCollections(this.props.params.user);
  },

  handleSubmit(newCol) {
    this.props.addCollection({ name: newCol.name });
  },

  toggleForm(e) {
    this.setState({ colFormVisible: !this.state.colFormVisible });
  },

  render() {
    var showAddButton = this.props.user && this.props.user.username === this.props.params.user;
    return (
      <section id="collectionList">
        <h1>Collections</h1>
        <CollectionBox collections={this.props.collections} deleteItem={this.handleDelete} />
        { this.state.colFormVisible ?
          <AddCollectionForm onLinkSubmit={this.handleSubmit} toggler={this.toggleForm} /> : null }
        { showAddButton && !this.state.colFormVisible ?
          <button onClick={this.toggleForm}>+</button> : null }
      </section>
    );
  }
});

export default connect(
  (state, props) => ({
    user: state.auth.user,
    collections: state.collections.list
  }),
  dispatch => ({
    addCollection: collection => dispatch(Actions.addCollection(collection)),
    getCollections: user => dispatch(Actions.getCollections(user)),
  })
)(Collections);
