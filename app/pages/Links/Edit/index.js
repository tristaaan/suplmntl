// LinkList
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Prompt } from 'react-router';
import { withRouter } from 'react-router-dom';

import LinksBox from './LinkBox';
import AddLinkForm from './AddLinkForm';
import get from '../../../utils/get';
import * as Actions from '../../../redux/actions/collections';

class EditLinks extends React.Component {
  static getDerivedStateFromProps(props) {
    const { collection } = props;
    if (collection.links && collection.links.length) {
      return { tmpCol: collection };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      tmpCol: props.collection,
      changes: false,
      redirect: false,
    };
  }

  componentDidMount() {
    const { collection, user, getCollection, match } = this.props;
    if (user.id !== collection.ownerId) {
      const viewString = `/${match.params.user}/${collection.postId}/view`;
      this.setState({ redirect: viewString });
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
    if ((this.state.changes
      && window.confirm('There are unsaved changes, are you sure you want to cancel?'))
      || !this.state.changes) {
      const { collection, user } = this.props;
      this.setState({ redirect: `/${user.username}/${collection.postId}/view` });
    }
  }

  done() {
    const { collection, user, updateCollection } = this.props;
    if (this.state.changes) {
      updateCollection(this.state.tmpCol);
    }
    this.setState({ redirect: `/${user.username}/${collection.postId}/view` });
  }

  updateTmpTitle(e) {
    const { tmpCol } = this.state;
    tmpCol.name = e.target.value;
    this.setState({ tmpCol, changes: true });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <section id="linkList" ref={(c) => {this.el = c;}}>
        <Prompt
          when={this.state.changes}
          message="There are unsaved changes, are you sure you want to leave?"
        />
        <div className="linkListHeader">
          <input
            ref={(c) => {this.titleEditor = c;}}
            onChange={(e) => this.updateTmpTitle(e)}
            value={this.state.tmpCol.name} />
          <button
            type="button"
            onClick={() => this.cancel()}
            style={{ margin: '0 4px' }}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => this.done()}>
            Done
          </button>
        </div>
        <LinksBox
          links={this.state.tmpCol.links}
          deleteItem={(index) => this.handleDelete(index)}
          onChange={(i, k, v) => this.updateItem(i, k, v)} />
        <AddLinkForm onLinkSubmit={(link) => this.handleSubmit(link)} />
      </section>
    );
  }
}

EditLinks.propTypes = {
  collection: PropTypes.object,
  getCollection: PropTypes.func,
  updateCollection: PropTypes.func,
  user: PropTypes.object,
  match: PropTypes.object,
};

EditLinks.defaultProps = {
  user: {},
  collection: { links: [] },
};

export default withRouter(connect(
  (state, ownProps) => {
    const nextProp = { collections: {}, user: {} };
    if (state.collections && state.collections.map) {
      nextProp.collection = state.collections.map[ownProps.match.params.id];
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
)(EditLinks));
