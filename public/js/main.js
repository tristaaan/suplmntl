var LinksBox = React.createClass({
  render: function() {
    var createItem = function(item) {
      return [
        (<dt><a href={item.link} target="_blank">{item.title}</a></dt>),
        (<dd>{item.description}</dd>)
      ];
    };
    return <dl>{this.props.links.map(createItem)}</dl>;
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
      url: '/title',
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
    return {links: []};
  },
  handleSubmit: function(newLink) {
    var nextLinks = this.state.links.concat([newLink]);
    this.setState({links: nextLinks});
  },
  render: function() {
    //var listTitle = $.ajax ... get title with id
    //this.setState({listTitle:listTitle});
    return (
      <section id="linkList">
        <RouteHandler/>
        { /*<h1>{this.state.linkTitle}</h1>*/ }
        <LinksBox links={this.state.links} />
        <AddLinkForm onLinkSubmit={this.handleSubmit} />
      </section>
    );
  }
});

//collection
var ColsBox = React.createClass({
  render: function() {
    var createItem = function(item) {
      return (
        <li>
          <Link to="list" params={{id: item.id}}>{item.title}</Link>
        </li>
      );
    };
    return (<ul>{this.props.links.map(createItem)}</ul>);
  }
});

var AddCollectionForm = React.createClass({
  getInitialState: function(){
    return {id: this.genId(), title:''};
  },
  genId: function(){
    return Math.floor(Math.random()*0xaabbcc);
  },
  handleChange: function(e){
    this.setState({title: e.target.value});
  },
  handleSubmit: function(e){
    if (!this.state.title){
      return;
    }
    this.props.onLinkSubmit(this.state);
    this.props.toggler();
  },
  render: function(){
    return (
      <form onSubmit={this.handleSubmit}>
        <input onChange={this.handleChange} value={this.state.title} autofocus/>
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
  handleSubmit: function(newCol) {
    var newCols = this.state.cols.concat([newCol]);
    this.setState({cols: newCols});
  },
  toggleForm: function(){
    this.setState({colFormVis: !this.state.colFormVis});
  },
  render: function() {
    return (
      <section id="collectionList">
        <RouteHandler/>
        <ColsBox links={this.state.cols} />
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