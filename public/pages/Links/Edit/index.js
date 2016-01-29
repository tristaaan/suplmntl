//LinkList
var React = require('react'),
  ReactDOM = require('react-dom'),
  Dropdown = require('../../Dropdown'),
  LinksBox = require('./LinkBox'),
  AddLinkForm = require('./AddLinkForm'),
  service = require('../../../service');

export default React.createClass({
  getInitialState() {
    return {links: [], 
      title: '', 
      tmpTitle: '', 
      renaming: false};
  },
  contextTypes: {
    router: React.PropTypes.object,
  },
  componentDidMount(){
    var id = this.props.routeParams.id;
    service.getLinks({id})
      .then((response) => {
        this.setState({id: id, 
          title: response.data.name, 
          tmpTitle: response.data.name, 
          links: response.data.items});
      })
      .catch((error) => {
        console.error(error.message);
      });
  },
  componentDidUpdate(prevState) {
    if (this.state.renaming) {
      ReactDOM.findDOMNode(this).addEventListener('keyup', this.keyPressed);
      this.refs.titleEditor.focus();
    }
    else {
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
    service.createLink({id: id, item: newLink})
      .then((response) => {
        var nextLinks = this.state.links.concat([newLink]);
        this.setState({links: nextLinks});
      })
      .catch((error) => {
        console.error(error.message());
      });
  },
  handleDelete(index) {
    var id = this.state.id;
    service.deleteLink({colId: id, index: index})
      .then((response) => {
        var newLinks = this.state.links;
        newLinks.splice(index, 1);
        this.setState({links: newLinks});
      })
      .catch((error) => {
        console.error(error.message);
      });
  },
  deleteList() {
    if(!confirm('Are you sure you want to delete "'+this.state.title+'"?')){
      return;
    }
    var id = this.state.id;
    service.deleteCollection({id})
      .then((response) => {
        this.context.router.replace('/collections');
      })
      .catch((error) => {
        console.error(error.message);
      });
  },
  keyPressed(e) {
    if (e.keyCode === 27) {
      this.setState({renaming: false});
      this.refs.dropdown.toggle(false);
    }
    else if (e.keyCode == 13) {
      this.setState({renaming: false, title: this.state.tmpTitle});
      service.updateCollectionTitle({id: this.state.id, title: this.state.tmpTitle})
        .catch((error) => {
          console.error(error.message);
        });
    }
  },
  renameList() {
    this.setState({renaming: true});
    this.refs.dropdown.toggle(false);
  },
  viewList() {
    this.context.router.push(`/list/${this.state.id}/view`);
  },
  updateTmpTitle(e) {
    this.setState({tmpTitle: e.target.value});
  },
  render() {
    return (
      <section id="linkList">
        <div className="linkListHeader">
          { this.state.renaming ? 
            <input ref="titleEditor" onChange={this.updateTmpTitle} value={this.state.tmpTitle}></input> 
            : <h1>{this.state.title}</h1>
          }
          <Dropdown ref="dropdown" buttonText="#">
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