// LinkList
import React from 'react';
import Dropdown from '../../Dropdown';
import LinksBox from './LinkBox';

import * as Actions from '../../../redux/actions/collections';
import { connect } from 'react-redux';

const ViewLinks = React.createClass({
  displayName: 'ViewLinks',

  propTypes: {
    name: React.PropTypes.string,
    links: React.PropTypes.array,
    getCollection: React.PropTypes.func,
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
    if (!this.props.name.length) {
      this.props.getCollection(this.props.params.id);
    }
  },

  editList() {
    this.context.router.push(`/list/${this.props.params.id}/edit`);
  },

  render() {
    return (
      <section id="linkList">
        <div className="linkListHeader">
          <h1>{this.props.name}</h1>
          <Dropdown buttonText="#">
            <ul className="dropdown-list">
              <li onClick={this.editList}>Edit List</li>
              <li onClick={() => {console.log('fork');}}>Fork List</li>
              <li onClick={() => {console.log('star');}}>Star List</li>
            </ul>
          </Dropdown>
        </div>
        <LinksBox links={this.props.links} />
      </section>
    );
  }
});

export default connect(
  (state, props) => {
    const collection = state.collections.map[props.params.id];
    return {
      name: collection ? collection.name : '',
      links: collection ? collection.links : []
    };
  },
  dispatch => ({
    getCollection: id => dispatch(Actions.getCollection(id))
  })
)(ViewLinks);
