// LinkList
import React from 'react';
import Dropdown from '../../Dropdown';
import LinksBox from './LinkBox';
import AddLinkForm from './AddLinkForm';
import * as Actions from '../../../redux/actions/collections';

import { connect } from 'react-redux';

const EditLinks = React.createClass({
  propTypes: {
    collection: React.PropTypes.object,
    username: React.PropTypes.string,
    deleteCollection: React.PropTypes.func,
    updateCollection: React.PropTypes.func,
  },

  contextTypes: {
    router: React.PropTypes.object,
  },

  getDefaultProps() {
    return {
      collection: {}
    };
  },

  getInitialState() {
    return {
      title: this.props.collection.name,
      tmpTitle: this.props.collection.name,
      renaming: false
    };
  },

  componentDidUpdate(prevState) {
    if (this.state.renaming) {
      this.el.addEventListener('keyup', this.keyPressed);
      this.titleEditor.focus();
    } else {
      this.el.removeEventListener('keyup', this.keyPressed);
    }
  },

  componentWillUnmount() {
    if (this.state.renaming) {
      this.el.removeEventListener('keyup', this.keyPressed);
    }
  },

  handleSubmit(newLink) {
    const newCol = Object.assign({}, this.props.collection);
    newCol.links.push(newLink);
    this.props.updateCollection(newCol);
  },

  handleDelete(index) {
    const newCol = Object.assign({}, this.props.collection);
    newCol.links.splice(index, 1);
    this.props.updateCollection(newCol);
  },

  deleteList() {
    if (!confirm(`Are you sure you want to delete ${this.state.title}?`)) {
      return;
    }
    this.props.deleteCollection(this.props.collection.id,
      `/${this.props.username}/collections`);
  },

  keyPressed(e) {
    if (e.keyCode === 27) {
      this.setState({ renaming: false });
      this.dropdown.toggle(false);
    } else if (e.keyCode === 13) {
      this.setState({ renaming: false, title: this.state.tmpTitle });
      const newCol = Object.assign({}, this.props.collection);
      newCol.name = this.state.tmpTitle;
      this.props.updateCollection(newCol);
    }
  },

  renameList() {
    this.setState({ renaming: true });
    this.dropdown.toggle(false);
  },

  viewList() {
    this.context.router.push(`/list/${this.props.collection.id}/view`);
  },

  updateTmpTitle(e) {
    this.setState({ tmpTitle: e.target.value });
  },

  render() {
    return (
      <section id="linkList" ref={(c) => {this.el = c;}}>
        <div className="linkListHeader">
          { this.state.renaming ?
            <input ref={(c) => {this.titleEditor = c;}} onChange={this.updateTmpTitle}
              value={this.state.tmpTitle} />
            : <h1>{this.state.title}</h1>
          }
          <Dropdown ref={(c) => {this.dropdown = c;}} buttonText="#">
            <ul className="dropdown-list">
              <li onClick={this.viewList}>Preview list</li>
              <li onClick={this.renameList}>Rename list</li>
              <li onClick={this.deleteList}>Delete list</li>
            </ul>
          </Dropdown>
        </div>
        <LinksBox links={this.props.collection.links} deleteItem={this.handleDelete} />
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
    if (state.auth && state.auth.user && state.auth.user.username) {
      nextProp.username = state.auth.user.username;
    }
    return nextProp;
  },
  dispatch => ({
    updateCollection: collection => dispatch(Actions.updateCollection(collection)),
    deleteCollection: (id, loc) => dispatch(Actions.deleteCollection(id, loc))
  })
)(EditLinks);
