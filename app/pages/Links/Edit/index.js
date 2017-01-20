// LinkList
import React from 'react';
import ReactDOM from 'react-dom';
import Dropdown from '../../Dropdown';
import LinksBox from './LinkBox';
import AddLinkForm from './AddLinkForm';
import * as service from '../../../service';

export default React.createClass({
  propTypes: {
    routeParams: React.PropTypes.object,
  },

  contextTypes: {
    router: React.PropTypes.object,
  },

  getInitialState() {
    return {
      links: [],
      title: '',
      tmpTitle: '',
      renaming: false
    };
  },

  componentDidMount() {
    var id = this.props.routeParams.id;
    service.getLinks({ id })
      .then((response) => {
        this.setState({
          id,
          title: response.data.name,
          tmpTitle: response.data.name,
          links: response.data.items
        });
      })
      .catch((error) => {
        console.error(error.message);
      });
  },

  componentDidUpdate(prevState) {
    if (this.state.renaming) {
      ReactDOM.findDOMNode(this).addEventListener('keyup', this.keyPressed);
      this.titleEditor.focus();
    } else {
      ReactDOM.findDOMNode(this).removeEventListener('keyup', this.keyPressed);
    }
  },

  componentWillUnmount() {
    if (this.state.renaming) {
      ReactDOM.findDOMNode(this).removeEventListener('keyup', this.keyPressed);
    }
  },
  handleSubmit(newLink) {
    var id = this.state.id;
    service.createLink({ id, item: newLink })
      .then((response) => {
        var nextLinks = this.state.links.concat([newLink]);
        this.setState({ links: nextLinks });
      })
      .catch((error) => {
        console.error(error.message());
      });
  },
  handleDelete(index) {
    var id = this.state.id;
    service.deleteLink({ colId: id, index })
      .then((response) => {
        var newLinks = this.state.links;
        newLinks.splice(index, 1);
        this.setState({ links: newLinks });
      })
      .catch((error) => {
        console.error(error.message);
      });
  },
  deleteList() {
    if (!confirm(`Are you sure you want to delete ${this.state.title}?`)) {
      return;
    }
    const id = this.state.id;
    service.deleteCollection({ id })
      .then((response) => {
        this.context.router.replace('/collections');
      })
      .catch((error) => {
        console.error(error.message);
      });
  },
  keyPressed(e) {
    if (e.keyCode === 27) {
      this.setState({ renaming: false });
      this.dropdown.toggle(false);
    } else if (e.keyCode === 13) {
      this.setState({ renaming: false, title: this.state.tmpTitle });
      service.updateCollectionTitle({ id: this.state.id, title: this.state.tmpTitle })
        .catch((error) => {
          console.error(error.message);
        });
    }
  },
  renameList() {
    this.setState({ renaming: true });
    this.dropdown.toggle(false);
  },
  viewList() {
    this.context.router.push(`/list/${this.state.id}/view`);
  },
  updateTmpTitle(e) {
    this.setState({ tmpTitle: e.target.value });
  },
  render() {
    return (
      <section id="linkList">
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
        <LinksBox links={this.state.links} deleteItem={this.handleDelete} />
        <AddLinkForm onLinkSubmit={this.handleSubmit} />
      </section>
    );
  }
});
