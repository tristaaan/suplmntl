//LinkList
var React = require('react'),
  ReactDOM = require('react-dom'),
  Dropdown = require('../../Dropdown'),
  LinksBox = require('./LinkBox'),
  service = require('../../../service');

export default React.createClass({
  getInitialState() {
    return {links: [], title: '', tmpTitle: '', renaming: false};
  },
  contextTypes: {
    router: React.PropTypes.object,
  },
  componentDidMount(){
    var id = this.props.routeParams.id;
    service.getLinks({id})
      .then((response) => {
        this.setState({id: id, 
          title: response.data.title, 
          tmpTitle: response.data.title, 
          links: response.data.links});
      })
      .catch((error) => {
        console.error(error.message);
      });
  },
  editList() {
    this.context.router.push(`/list/${this.state.id}/edit`);
  },
  render() {
    return (
      <section id="linkList">
        <div className="linkListHeader">
          <h1>{this.state.title}</h1>
          <Dropdown ref="dropdown" buttonText="#">
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