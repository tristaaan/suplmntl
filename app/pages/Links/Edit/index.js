// LinkList
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';

import LinksBox from './LinkBox';
import AddLinkForm from './AddLinkForm';
import get from '../../../utils/get';
import * as Actions from '../../../redux/actions/collections';
import history from '../../../history';

class EditLinks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tmpCol: props.collection,
      changes: false,
    };
  }

  componentDidMount() {
    const { collection, user, getCollection, match } = this.props;
    if (user.id !== collection.ownerId) {
      history.replace(`/${match.params.user}/${collection.postId}/view`);
      return;
    }

    if (!collection.name) {
      getCollection(match.params.id);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.changes) {
      window.onbeforeunload = () => 'There are unsaved changes, are you sure you want to leave?';
    }
  }

  componentWillUnmount() {
    if (window.onbeforeunload) {
      window.onbeforeunload = null;
    }
  }

  handleSubmit(newLink) {
    const { collection } = this.props;
    collection.links.push(newLink);
    this.setState({ tmpCol: collection, changes: true });
  }

  handleDelete(index) {
    const { collection } = this.props;
    collection.links.splice(index, 1);
    this.setState({ tmpCol: collection, changes: true });
  }

  updateItem(index, key, value) {
    const { tmpCol } = this.state;
    tmpCol.links[index][key] = value;
    this.setState({ tmpCol, changes: true });
  }

  cancel() {
    if ((this.changes
      && window.confirm('There are unsaved changes, are you sure you want to cancel?'))
      || !this.changes) {
      const { collection, user } = this.props;
      history.push(`/${user.username}/${collection.postId}/view`);
    }
  }

  done() {
    const { collection, user, updateCollection } = this.props;
    if (this.changes) {
      updateCollection(this.state.tmpCol);
    }
    history.push(`/${user.username}/${collection.postId}/view`);
  }

  updateTmpTitle(e) {
    const { tmpCol } = this.state;
    tmpCol.name = e.target.value;
    this.setState({ tmpCol, changes: true });
  }

  render() {
    return (
      <section id="linkList" ref={(c) => {this.el = c;}}>
        <Prompt
          when={this.changes}
          message="There are unsaved changes, are you sure you want to leave?"
        />
        <div className="linkListHeader">
          <input
            ref={(c) => {this.titleEditor = c;}}
            onChange={this.updateTmpTitle}
            value={this.state.tmpCol.name} />
          <button
            type="button"
            onClick={this.cancel}
            style={{ margin: '0 4px' }}>
            Cancel
          </button>
          <button
            type="button"
            onClick={this.done}>
            Done
          </button>
        </div>
        <LinksBox
          links={this.state.tmpCol.links}
          deleteItem={this.handleDelete}
          onChange={this.updateItem} />
        <AddLinkForm onLinkSubmit={this.handleSubmit} />
      </section>
    );
  }
}

EditLinks.propTypes = {
  collection: PropTypes.object,
  getCollection: PropTypes.func,
  updateCollection: PropTypes.func,
  params: PropTypes.object,
  user: PropTypes.object,
  match: PropTypes.object,
};

EditLinks.defaultProps = {
  user: {},
  collection: { links: [] },
};

export default connect(
  (state, props) => {
    const nextProp = { collections: {}, username: '' };
    if (state.collections && state.collections.map) {
      nextProp.collection = state.collections.map[props.params.id];
    }
    if (get(state.auth, 'user.username')) {
      nextProp.user = state.auth.user;
    }
    return nextProp;
  },
  (dispatch) => ({
    updateCollection: (collection) => dispatch(Actions.updateCollection(collection)),
    getCollection: (id) => dispatch(Actions.getCollection(id)),
    deleteCollection: (id, loc) => dispatch(Actions.deleteCollection(id, loc)),
  })
)(EditLinks);
