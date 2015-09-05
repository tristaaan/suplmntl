//router
var React = require('react'),
  Router = require('react-router'),
  Link = Router.Link,
  Route = Router.Route,
  RouteHandler = Router.RouteHandler;

var CollectionList = require('./CollectionList'),
  LinkList = require('./LinkList');

var App = React.createClass({
  render() {
    return (
      <div>
        <header>
          <h1>Tengla</h1>
          <ul>
            <li><Link className="headerLink" to="collections">Collections</Link></li>
            <li><Link className="headerLink" to="collections">Login</Link></li>
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