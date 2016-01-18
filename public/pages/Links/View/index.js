//LinkList
var React = require('react'),
  ReactDOM = require('react-dom'),
  ajax = require('jquery').ajax,
  Dropdown = require('../../Dropdown'),
  LinksBox = require('./LinkBox');

export default React.createClass({
  getInitialState() {
    return {links: [], title: '', tmpTitle: '', renaming: false};
  },
  contextTypes: {
    router: React.PropTypes.object,
  },
  componentDidMount(){
    var id = this.props.routeParams.id;
    ajax({
      url: '/api/collection',
      dataType: 'json',
      type: 'GET',
      data: {id: id},
      success: function(data) {
        this.setState({id: id, title: data.title, tmpTitle: data.title, links: data.links});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(err.toString());
      }.bind(this)
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