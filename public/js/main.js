var LinksBox = React.createClass({
  render: function() {
    var createItem = function(item, index) {
      return [
        (<dt><a href={item.link} target="_blank">{item.title}</a></dt>),
        (
          <dd>
            <p>{item.description}</p>
            <button onClick={this.deleteItem} value={index}>x</button>
          </dd>
        )
      ];
    };
    return <dl>{this.props.links.map(createItem, this)}</dl>;
  },
  deleteItem: function(e){
    this.props.deleteItem(e.target.value);
  }
});

var AddLinkForm = React.createClass({
  getInitialState: function() {
    return {title: '', link:'', description: ''};
  },
  handleSubmit: function(e){
    e.preventDefault();

    if (!this.state.title || !this.state.link || !this.state.description) {
      return;
    }

    this.props.onLinkSubmit(this.state);
    this.setState(this.getInitialState());
    this.refs.submitButton.getDOMNode().blur();
    this.refs.titleInput.getDOMNode().focus();
  },
  //in larger forms avoid having an update function for everything.
  updateTitle: function(e){
    this.setState({title: e.target.value});
  },
  updateDescription: function(e){
    this.setState({description: e.target.value});
  },  
  fetchTitle: function(e){
    var link = e.target.value;
    if (link.length == 0){
      return;
    }
    this.setState({title: link});
    $.ajax({
      url: '/api/title',
      dataType: 'json',
      type: 'POST',
      data: {url: link}, //problem here?
      success: function(data) {
        this.setState({title: data.title, link:link});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(err.toString());
      }.bind(this)
    });
  },
  render: function(){
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" name="title" placeholder="link" 
          ref="titleInput"
          onBlur={this.fetchTitle} 
          onChange={this.updateTitle} 
          value={this.state.title}
          autofocus/>
        <textarea name="description" placeholder="description" onChange={this.updateDescription} value={this.state.description}/>
        <button ref="submitButton">Save</button>
      </form>
    );
  }
});

var LinkList = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function() {
    return {links: [], title: ''};
  },
  componentDidMount: function(){
    var id = this.context.router.getCurrentParams().id;
    $.ajax({
      url: '/api/collection',
      dataType: 'json',
      type: 'GET',
      data: {id: id},
      success: function(data) {
        this.setState({id: id, title: data.title, links: data.links});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(err.toString());
      }.bind(this)
    });
  },
  handleSubmit: function(newLink) {
    var id = this.state.id;
    $.ajax({
      url: '/api/link',
      dataType: 'json',
      type: 'POST',
      data: {id: id, item: newLink},
      error: function(xhr, status, err) {
        console.error(err.toString());
      }.bind(this)
    });
    var nextLinks = this.state.links.concat([newLink]);
    this.setState({links: nextLinks});
  },
  handleDelete: function(index){
    var id = this.state.id;
    $.ajax({
      url: '/api/link',
      dataType: 'json',
      type: 'DELETE',
      data: {colId: id, index: index},
      error: function(xhr, status, err) {
        console.error(err.toString());
      }.bind(this)
    });
    var newLinks = this.state.links;
    newLinks.splice(index, 1);
    this.setState({links: newLinks});
  },
  render: function() {
    return (
      <section id="linkList">
        <RouteHandler/>
        <h1>{this.state.title}</h1>
        <LinksBox links={this.state.links} deleteItem={this.handleDelete} />
        <AddLinkForm onLinkSubmit={this.handleSubmit} />
      </section>
    );
  }
});

//collection
var ColsBox = React.createClass({
  render: function() {
    var createItem = function(item, index) {
      return (
        <li>
          <Link to="list" params={{id: item.id}}>{item.title}</Link>
          <button onClick={this.deleteItem} value={index}>x</button>
        </li>
      );
    };
    return (<ul>{this.props.links.map(createItem, this)}</ul>);
  },
  deleteItem: function(e){
    this.props.deleteItem(e.target.value);
  }
});

var AddCollectionForm = React.createClass({
  getInitialState: function(){
    return {id: this.genId(), title:''};
  },
  componentDidMount: function(){
    this.refs.titleInput.getDOMNode().focus(); 
  },
  genId: function(){
    return Math.floor(Math.random()*0xaabbcc);
  },
  handleChange: function(e){
    this.setState({title: e.target.value});
  },
  handleSubmit: function(e){
    if (!/\S/.test(this.state.title)){
      return;
    }
    this.props.onLinkSubmit(this.state);
    this.props.toggler();
  },
  render: function(){
    return (
      <form onSubmit={this.handleSubmit}>
        <input onChange={this.handleChange} value={this.state.title} ref="titleInput"/>
        <button>Add</button>
        <button onClick={this.props.toggler}>Cancel</button>
      </form>
    );
  }
});

var CollectionList = React.createClass({
  getInitialState: function() {
    return {cols: [], colFormVis: false};
  },
  componentDidMount: function(){
    $.ajax({
      url: '/api/collections',
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        this.setState({cols:data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(err.toString());
      }.bind(this)
    });
  },
  handleSubmit: function(newCol) {
    $.ajax({
      url: '/api/collection',
      dataType: 'json',
      type: 'POST',
      data: {newId: newCol.id, title: newCol.title},
      error: function(xhr, status, err) {
        console.error(err.toString());
      }.bind(this)
    });
    var newCols = this.state.cols.concat([newCol]);
    this.setState({cols: newCols});
  },
  handleDelete: function(index){
    var id = this.state.cols[index].id;
    $.ajax({
      url: '/api/collection',
      dataType: 'json',
      type: 'DELETE',
      data: {id: id},
      error: function(xhr, status, err) {
        console.error(err.toString());
      }.bind(this)
    });
    var newCols = this.state.cols;
    newCols.splice(index, 1);
    this.setState({cols: newCols});
  },
  toggleForm: function(){
    this.setState({colFormVis: !this.state.colFormVis});
  },
  render: function() {
    return (
      <section id="collectionList">
        <RouteHandler/>
        <ColsBox links={this.state.cols} deleteItem={this.handleDelete} />
        { this.state.colFormVis ? <AddCollectionForm onLinkSubmit={this.handleSubmit} toggler={this.toggleForm} /> : null }
        { !this.state.colFormVis ? <button onClick={this.toggleForm}>+</button> : null }
      </section>
    );
  }
});

//router
var Router = ReactRouter;

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var App = React.createClass({
  render: function () {
    return (
      <div>
        <header>
          <ul>
            <li><Link to="collections">Collections</Link></li>
          </ul>
        </header>

        <RouteHandler/>
      </div>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="collections" handler={CollectionList}/>
    <Route name="list" path="/list/:id" handler={LinkList}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('content'));
});

// Router.run(routes, Router.HistoryLocation, function (Handler) {
//   React.render(<Handler/>, document.getElementById('content'));
// });

// React.render(
//   <LinkList />,
//   document.getElementById('content')
// );