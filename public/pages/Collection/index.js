//CollectionList 
import React from 'react';
import CollectionBox from './CollectionBox';
import AddCollectionForm from './AddCollectionForm';
import * as service from '../../service';

export default React.createClass({
  getInitialState() {
    return {cols: [], colFormVisible: false};
  },
  componentDidMount() {
    service.getCollections()
      .then((response) => {
        this.setState({cols: response.data});
      })
      .catch((error) => {
        console.error(error.message);
      });
  },
  handleSubmit(newCol) {
    service.createCollection({name: newCol.name})
      .then((response) => {
        newCol['id'] = response.data.newId;
        var newCols = this.state.cols.concat([newCol]);
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
    return (
      <section id="collectionList">
        <h1>Collections</h1>
        <CollectionBox links={this.state.cols} deleteItem={this.handleDelete} />
        { this.state.colFormVisible ? <AddCollectionForm onLinkSubmit={this.handleSubmit} toggler={this.toggleForm} /> : null }
        { !this.state.colFormVisible ? <button onClick={this.toggleForm}>+</button> : null }
      </section>
    );
  }
});