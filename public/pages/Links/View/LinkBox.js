//LinkBox
var React = require('react');

export default React.createClass({
  render() {
    var createItem = function(item, index) {
      return (
        <div className="linkItem" key={index}>
          <dt>
            <a href={item.link} target="_blank">{item.title}</a>
          </dt>
          <dd>
            <p>{item.description}</p>
          </dd>
        </div>
      );
    };
    return <dl>{this.props.links.map(createItem, this)}</dl>;
  }
});