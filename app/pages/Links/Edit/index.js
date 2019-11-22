// LinkList
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';

import LinksBox from './LinkBox';
import AddLinkForm from './AddLinkForm';
import get from '../../../utils/get';
import * as Actions from '../../../redux/actions/collections';

class EditLinks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tmpCol: props.collection,
      changes: false,
      ...props
    };
  }

  getDefaultProps() {
    return {
      user: {},
      collection: { links: [] }
    };
  }

  componentDidMount() {
    if (!this.collection.name) {
      this.getCollection(this.params.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.id !== nextProps.collection.ownerId) {
      this.context.router.replace(`/${this.props.params.user}/${this.props.collection.postId}/view`);
      return;
    }

    if (nextProps.collection.name.length && !this.state.tmpCol.name) {
      this.setState({ tmpCol: nextProps.collection });
    }
  }

  componentDidUpdate(nextProps, nextState) {
    if (nextState.changes) {
      window.onbeforeunload = () => 'There are unsaved changes, are you sure you want to leave?';
    }

    this.context.router.setRouteLeaveHook(
      this.route,
      (nextLoc) => {
        if (this.changes) {
          return 'There are unsaved changes, are you sure you want to leave?';
        }
        return false;
      }
    );
  }

  componentWillUnmount() {
    if (window.onbeforeunload) {
      window.onbeforeunload = null;
    }
  }

  handleSubmit(newLink) {
    const newCol = { ...this.collection };
    newCol.links.push(newLink);
    this.setState({ tmpCol: newCol, changes: true });
  }

  handleDelete(index) {
    const newCol = { ...this.collection };
    newCol.links.splice(index, 1);
    this.setState({ tmpCol: newCol, changes: true });
  }

  updateItem(index, key, value) {
    const { tmpCol } = this.state;
    tmpCol.links[index][key] = value;
    this.setState({ tmpCol, changes: true });
  }

  cancel() {
    if ((this.state.changes
      && window.confirm('There are unsaved changes, are you sure you want to cancel?'))
      || !this.state.changes) {
      this.context.router.setRouteLeaveHook(this.props.route, () => {});
      this.context.router.push(`/${this.props.user.username}/${this.props.collection.postId}/view`);
    }
  }

  done() {
    if (this.state.changes) {
      this.context.router.setRouteLeaveHook(this.props.route, () => {});
      this.props.updateCollection(this.state.tmpCol);
    }
    this.context.router.push(`/${this.props.user.username}/${this.props.collection.postId}/view`);
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
          message="Are you sure you want to leave?"
        />
        <div className="linkListHeader">
          <input ref={(c) => {this.titleEditor = c;}}
            onChange={this.updateTmpTitle}
            value={this.tmpCol.name} />
          <button type="button"
            onClick={this.cancel}
            style={{ margin: '0 4px' }}>
            Cancel
          </button>
          <button type="button"
            onClick={this.done}>
            Done
          </button>
        </div>
        <LinksBox links={this.tmpCol.links}
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
  route: PropTypes.object,
  user: PropTypes.object,
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
    deleteCollection: (id, loc) => dispatch(Actions.deleteCollection(id, loc))
  })
)(EditLinks);
