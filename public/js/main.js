// libs
var React = require('react'),
  ReactDOM = require('react-dom'),
  ReactRouter = require('react-router'),
  Router = ReactRouter.Router,
  Route = ReactRouter.Route,
  Link = ReactRouter.Link;

// componenets
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
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
});

var routes = (
  <Router  path="/" component={App}>
    <Route  path="/login" component={Login} />
    <Route  path="/sign-up" component={SignUp} />
    <Route  path="/collections" component={CollectionList} />
    <Route  path="/list/:id" component={LinkList} />
  </Router>
);

ReactDOM.render(<Router routes={routes} />, document.getElementById('content'));
