//Collection Box
var React = require('react');

import {Link} from 'react-router';

export default React.createClass({
  render: function() {
    var createItem = function(item, index) {
      return (
        <li key={item.id}>
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