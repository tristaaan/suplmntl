// CollectionList
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CollectionBox from './CollectionBox';
import AddCollectionForm from './AddCollectionForm';
import * as Actions from '../../redux/actions/collections';
import setTitle from '../../utils/setTitle';

class Collections extends React.component {
  getDefaultProps() {
    return { collections: [] };
  }

  getInitialState() {
    return { colFormVisible: false };
  }

  componentDidMount() {
    this.props.getCollections(this.props.params.user);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.user !== nextProps.params.user) {
      this.props.getCollections(nextProps.params.user);
    }
    if (nextProps.user) {
      setTitle(`${nextProps.user.username}'s collections`);
    }
  }

  handleSubmit(newCol) {
    this.props.addCollection({ name: newCol.name });
  }

  toggleForm(e) {
    const newVal = !this.state.colFormVisible;
    this.setState({ colFormVisible: newVal });
  }

  render() {
    if (this.props.error) {
      return (<section id="collectionList">{this.props.error}</section>);
    }

    const showAddButton = this.props.user && this.props.user.username === this.props.params.user;
    return (
      <section id="collectionList">
        <h1>
          {this.props.params.user}
          &apos;s Collections
        </h1>
        <CollectionBox collections={this.props.collections}
          deleteItem={this.handleDelete}
          username={this.props.params.user} />
        { this.state.colFormVisible
          ? <AddCollectionForm onLinkSubmit={this.handleSubmit} toggler={this.toggleForm} />
          : null }
        { showAddButton && !this.state.colFormVisible
          ? <button type="button" className="addItemButton" onClick={this.toggleForm}>+</button>
          : null }
      </section>
    );
  }
}

Collections.propTypes = {
  user: PropTypes.object,
  error: PropTypes.string,
  collections: PropTypes.array,
  getCollections: PropTypes.func,
  addCollection: PropTypes.func,
  params: PropTypes.object,
};

export default connect(
  (state, props) => ({
    user: state.auth.user,
    error: state.auth.error || state.collections.error,
    collections: state.collections.list.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }),
  }),
  (dispatch) => ({
    addCollection: (collection) => dispatch(Actions.addCollection(collection)),
    getCollections: (user) => dispatch(Actions.getCollections(user)),
  })
)(Collections);
