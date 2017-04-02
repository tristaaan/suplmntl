// LinkList
import React from 'react';
import { Link } from 'react-router';
import Dropdown from '../../Dropdown';
import LinksBox from './LinkBox';
import get from '../../../utils/get';
import setTitle from '../../../utils/setTitle';
import { jsonToMarkdown } from '../../../utils/exporter';

import * as Actions from '../../../redux/actions/collections';
import { connect } from 'react-redux';

const ViewLinks = React.createClass({
  displayName: 'ViewLinks',

  propTypes: {
    collection: React.PropTypes.object,
    user: React.PropTypes.object,
    getCollection: React.PropTypes.func,
    forkCollection: React.PropTypes.func,
    deleteCollection: React.PropTypes.func,
    params: React.PropTypes.object
  },

  contextTypes: {
    router: React.PropTypes.object,
  },

  componentDidMount() {
    if (!Object.keys(this.props.collection).length) {
      this.props.getCollection(this.props.params.id);
    }
  },

  componentWillReceiveProps(nextProps) {
    if (!get(this.props, 'collection.name.length') || this.props.collection.postId !== nextProps.params.id) {
      this.props.getCollection(nextProps.params.id);
    }
    if (nextProps.collection.name) {
      setTitle(`${nextProps.collection.name}`);
    }
  },

  forkList() {
    if (this.props.user) {
      this.props.forkCollection(this.props.collection._id, this.props.user);
    } else {
      this.context.router.push('/login');
    }
  },

  editList() {
    this.context.router.push(`/${this.props.user.username}/${this.props.params.id}/edit`);
  },

  downloadMarkdownList() {
    const newFileContent = new Blob([jsonToMarkdown(this.props.collection)], {
      type: 'text/plain',
    });
    const downloadURL = window.URL.createObjectURL(newFileContent);
    const downloadLink = document.getElementById('download-link');

    downloadLink.href = downloadURL;
    downloadLink.download = `${this.props.collection.name}.md`;
    downloadLink.click();
    console.log('download?');
    // Free memory
    setTimeout(() => {
      window.URL.revokeObjectURL(downloadURL);
    }, 1000);
  },

  deleteList() {
    if (!confirm(`Are you sure you want to delete this collection:\n"${this.props.collection.name}"?`)) {
      return;
    }
    this.props.deleteCollection(this.props.collection._id,
      `/${this.props.user.username}/collections`);
  },

  render() {
    const user = get(this.props, 'user');
    const { name, forkOf, owner } = this.props.collection;
    const isOwner = user && user._id === get(this.props, 'collection.owner._id');

    let sub = null;
    if (forkOf) {
      sub = (<small>by <Link to={`/${owner.username}/collections`}>{ owner.username }</Link>
        &nbsp;- fork of: <Link to={`/list/${forkOf.postId}/view`}>{forkOf.owner.username}/{forkOf.name}</Link>
        </small>);
    } else if (owner) {
      sub = (<small>by <Link to={`/${owner.username}/collections`}>{ owner.username }</Link></small>);
    }

    return (
      <section id="linkList">
        <div className="linkListHeader">
          <div className="linkListTitle">
            <h1>{name}</h1>
            { sub }
          </div>
          <Dropdown buttonText="#">
            <ul className="dropdown-list">
              {/* <li onClick={() => {console.log('star, wayyy unimplemented');}}>Star List</li> */}
              <li onClick={this.forkList}>Fork List</li>
              { isOwner ? <li onClick={this.editList}>Edit List</li> : null}
              { isOwner ? <li onClick={this.deleteList}>Delete list</li> : null}
              { isOwner ? <li onClick={this.downloadMarkdownList}>List to Markdown</li> : null}
            </ul>
          </Dropdown>
        </div>
        <LinksBox links={this.props.collection.links} />
      </section>
    );
  }
});

export default connect(
  (state, props) => {
    let collection = {};
    if (state.collections.map[props.params.id]) {
      collection = state.collections.map[props.params.id];
    }
    return {
      collection,
      user: state.auth.user
    };
  },
  dispatch => ({
    getCollection: id => dispatch(Actions.getCollection(id)),
    forkCollection: (id, user) => dispatch(Actions.forkCollection(id, user)),
    deleteCollection: (id, loc) => dispatch(Actions.deleteCollection(id, loc))
  })
)(ViewLinks);
