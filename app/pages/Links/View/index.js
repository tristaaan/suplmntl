// LinkList
import React from 'react';
import { Link } from 'react-router';
import Dropdown from '../../Dropdown';
import LinksBox from './LinkBox';
import get from '../../../utils/get';

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

  getDefaultProps() {
    return {
      links: [],
      name: ''
    };
  },

  getInitialState() {
    return { renaming: false };
  },

  componentDidMount() {
    this.props.getCollection(this.props.params.id);
  },

  componentWillReceiveProps() {
    if (!get(this.props, 'collection.name.length')) {
      this.props.getCollection(this.props.params.id);
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
    this.context.router.push(`/list/${this.props.params.id}/edit`);
  },

  deleteList() {
    if (!confirm(`Are you sure you want to delete ${this.state.title}?`)) {
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
              <li onClick={() => {console.log('star, wayyy unimplemented');}}>Star List</li>
              <li onClick={this.forkList}>Fork List</li>
              { isOwner ? <li onClick={this.editList}>Edit List</li> : null}
              { isOwner ? <li onClick={this.deleteList}>Delete list</li> : null}
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
