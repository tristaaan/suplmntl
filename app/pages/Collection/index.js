//CollectionList 
import React from 'react';
import CollectionBox from './CollectionBox';
import AddCollectionForm from './AddCollectionForm';
import * as service from '../../service';

import { connect } from 'react-redux';

const Collections = React.createClass({
  getInitialState() {
    return {cols: [], colFormVisible: false};
  },
  componentDidMount() {
    service.getCollections(this.props.params.user)
      .then((resp) => {
        if (Object.keys(resp.data).length) {
          this.setState({cols: resp.data});
        } else {
          this.setState({cols: []});
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  },
  handleSubmit(newCol) {
    service.createCollection({name: newCol.name})
      .then((resp) => {
        newCol['id'] = resp.data.newId;
        var newCols = this.state.cols.concat([ newCol ]);
        this.setState({cols: newCols});
      })
      .catch((error) => {
        console.error(error.message);
      });
  },
  toggleForm(e) {
    this.setState({colFormVisible: !this.state.colFormVisible});
  },
  render() {
    var showAddButton = this.props.user && this.props.user.username === this.props.params.user;
    return (
      <section id="collectionList">
        <h1>Collections</h1>
        <CollectionBox links={this.state.cols} deleteItem={this.handleDelete} />
        { this.state.colFormVisible ? <AddCollectionForm onLinkSubmit={this.handleSubmit} toggler={this.toggleForm} /> : null }
        { showAddButton && !this.state.colFormVisible ? <button onClick={this.toggleForm}>+</button> : null }
      </section>
    );
  }
});

export default connect(
  state => ({
    user: state.auth.user
  })
)(Collections)