//router
var React = require('react'),
  Router = require('react-router'),
  Link = Router.Link,
  Route = Router.Route,
  RouteHandler = Router.RouteHandler;

var CollectionList = require('./CollectionList'),
  LinkList = require('./LinkList'),
  Login = require('./Login'),
  SignUp = require('./SignUp');

var App = React.createClass({
  render() {
    return (
      <div>
        <header>
          <h1><Link to="/">Tengla</Link></h1>
          <ul>
            <li><Link className="headerLink" to="collections">Collections</Link></li>
            <li><Link className="headerLink" to="login">Login</Link></li>
          </ul>
        </header>

        <RouteHandler/>
      </div>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="login" path="/login" handler={Login} />
    <Route name="sign-up" path="/sign-up" handler={SignUp} />
    <Route name="collections" handler={CollectionList} />
    <Route name="list" path="/list/:id" handler={LinkList} />
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('content'));
});