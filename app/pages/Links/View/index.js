// LinkList
import React from 'react';
import Dropdown from '../../Dropdown';
import LinksBox from './LinkBox';

import * as Actions from '../../../redux/actions/collections';
import { connect } from 'react-redux';

const ViewLinks = React.createClass({
  displayName: 'ViewLinks',

  propTypes: {
    params: React.PropTypes.object
  },

  contextTypes: {
    router: React.PropTypes.object,
  },

  getInitialState() {
    return { links: [], name: '', renaming: false };
  },

  editList() {
    this.context.router.push(`/list/${this.state.id}/edit`);
  },

  render() {
    return (
      <section id="linkList">
        <div className="linkListHeader">
          <h1>{this.state.name}</h1>
          <Dropdown buttonText="#">
            <ul className="dropdown-list">
              { true ? <li onClick={this.editList}>Edit List</li> : <li onClick={() => {console.log('fork');}}>Fork List</li>}
              <li onClick={() => {console.log('star');}}>Star List</li>
            </ul>
          </Dropdown>
        </div>
        <LinksBox links={this.state.links} />
      </section>
    );
  }
});

export default connect(
  (state, props) => {
    const links = state.collections;
    return {
      links
    };
  },
  () => ({

  })
)(ViewLinks);
