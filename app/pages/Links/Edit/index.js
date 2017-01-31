// LinkList
import React from 'react';
import LinksBox from './LinkBox';
import AddLinkForm from './AddLinkForm';
import get from '../../../utils/get';
import * as Actions from '../../../redux/actions/collections';

import { connect } from 'react-redux';

const EditLinks = React.createClass({
  propTypes: {
    collection: React.PropTypes.object,
    user: React.PropTypes.object,
    getCollection: React.PropTypes.func,
    updateCollection: React.PropTypes.func,
    params: React.PropTypes.object,
  },

  contextTypes: {
    router: React.PropTypes.object,
  },

  getDefaultProps() {
    return {
      user: {},
      collection: { links: [] }
    };
  },

  getInitialState() {
    return {
      tmpCol: this.props.collection,
      changes: false,
      renaming: false
    };
  },

  componentDidMount() {
    if (this.props.user.id !== this.props.collection.ownerId) {
      this.context.router.replace(`/list/${this.props.collection.postId}/view`);
      return;
    }

    if (!this.props.collection.name) {
      this.props.getCollection(this.props.params.id);
    }
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.collection.name.length && !this.state.tmpCol.name) {
      this.setState({ tmpCol: nextProps.collection });
    }
  },

  handleSubmit(newLink) {
    const newCol = Object.assign({}, this.props.collection);
    newCol.links.push(newLink);
    this.setState({ tmpCol: newCol, changes: true });
  },

  handleDelete(index) {
    const newCol = Object.assign({}, this.props.collection);
    newCol.links.splice(index, 1);
    this.setState({ tmpCol: newCol, changes: true });
  },

  cancel() {
    this.context.router.push(`/list/${this.props.collection.postId}/view`);
  },

  done() {
    if (this.state.changes) {
      this.props.updateCollection(this.state.tmpCol);
    }
    this.context.router.push(`/list/${this.props.collection.postId}/view`);
  },

  updateTmpTitle(e) {
    const tmpCol = Object.assign({}, this.state.tmpCol);
    tmpCol.name = e.target.value;
    this.setState({ tmpCol, changes: true });
  },

  render() {
    return (
      <section id="linkList" ref={(c) => {this.el = c;}}>
        <div className="linkListHeader">
          <input ref={(c) => {this.titleEditor = c;}} onChange={this.updateTmpTitle}
            value={this.state.tmpCol.name} />
          <button onClick={this.cancel}>Cancel</button>
          <button onClick={this.done}>Done</button>
        </div>
        <LinksBox links={this.state.tmpCol.links} deleteItem={this.handleDelete} />
        <AddLinkForm onLinkSubmit={this.handleSubmit} />
      </section>
    );
  }
});

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
  dispatch => ({
    updateCollection: collection => dispatch(Actions.updateCollection(collection)),
    getCollection: id => dispatch(Actions.getCollection(id)),
    deleteCollection: (id, loc) => dispatch(Actions.deleteCollection(id, loc))
  })
)(EditLinks);
