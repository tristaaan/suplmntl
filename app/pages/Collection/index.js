// CollectionList
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CollectionBox from './CollectionBox';
import AddCollectionForm from './AddCollectionForm';
import * as Actions from '../../redux/actions/collections';
import setTitle from '../../utils/setTitle';

class Collections extends React.Component {
  constructor(props) {
    super(props);
    this.state = { colFormVisible: false };
  }

  componentDidMount() {
    const user = this.props.match.params.user.toLowerCase();
    this.props.getCollections(user);
  }

  componentDidUpdate(prevProps) {
    const prevUser = prevProps.match.params.user.toLowerCase();
    const currUser = this.props.match.params.user.toLowerCase();
    if (prevUser !== currUser) {
      this.props.getCollections(currUser);
    }
    if (currUser) {
      setTitle(`${currUser}'s collections`);
    }
  }

  handleSubmit(newCol) {
    this.props.addCollection({ name: newCol.name });
  }

  toggleForm() {
    const { colFormVisible } = this.state;
    this.setState({ colFormVisible: !colFormVisible });
  }

  render() {
    if (this.props.error) {
      return (<section id="collectionList">{this.props.error}</section>);
    }

    const { user } = this.props.match.params;

    const showAddButton = this.props.user && this.props.user.username === user;
    return (
      <section id="collectionList">
        <h1>
          {user}
          &apos;s Collections
        </h1>
        <CollectionBox
          collections={this.props.collections}
          deleteItem={() => this.handleDelete()}
          username={user} />
        { this.state.colFormVisible
          ? (
            <AddCollectionForm
              onLinkSubmit={(e) => this.handleSubmit(e)}
              toggler={() => this.toggleForm()} />
          )
          : null }
        { showAddButton && !this.state.colFormVisible
          ? (
            <button
              type="button"
              className="addItemButton"
              onClick={() => this.toggleForm()}>
              +
            </button>
          )
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
  match: PropTypes.object,
};

Collections.defaltProps = {
  collections: []
};

export default connect(
  (state) => ({
    user: state.auth.user,
    error: state.auth.error || state.collections.error,
    collections: state.collections.list.sort((a, b) => (
      new Date(b.createdAt) - new Date(a.createdAt)
    )),
  }),
  (dispatch) => ({
    addCollection: (collection) => dispatch(Actions.addCollection(collection)),
    getCollections: (user) => dispatch(Actions.getCollections(user)),
  })
)(Collections);
