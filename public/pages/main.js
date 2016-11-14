// libs
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory } from 'react-router';

// componenets
import CollectionList from './Collection';
import LinksEdit from './Links/Edit';
import LinksView from './Links/View';
import Login from './Login';
import SignUp from './SignUp';

var App = React.createClass({
  render() {
    return (
      <div>
        <header>
          <ul className="headerLink-container">
            <li><h1><Link to="/">Tengla</Link></h1></li>
            <li><Link className="headerLink" to="collections">Collections</Link></li>
            <li className="spacer"></li>
            <li><Link className="headerLink" to="login">Login</Link></li>
            <li><Link className="headerLink" to="sign-up">Sign Up</Link></li>
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
    <Route  path="/list/:id/edit" component={LinksEdit} />
    <Route  path="/list/:id/view" component={LinksView} />
  </Router>
);

ReactDOM.render(<Router history={hashHistory} routes={routes} />, document.getElementById('content'));
