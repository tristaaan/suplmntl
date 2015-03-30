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
  handleSubmit: function(e){
    e.preventDefault();
    var title = e.target.title.value.trim();
    var link = e.target.link.value.trim();
    var description = e.target.description.value.trim();

    if (!title || !link || !description) {
      return;
    }

    this.props.onLinkSubmit(title, link, description);
  },

  fetchTitle: function(e){
    var link = e.target.value;
    if (link.length == 0){
      return;
    }

    $.ajax({
      url: '/title',
      dataType: 'text',
      type: 'POST',
      data: {url: link}, //problem here?
      success: function(data) {
        this.setState({title: data, link:link});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function(){
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" name="title" placeholder="link" onChange={this.fetchTitle} value={this.title}/>
        <input type="text" name="link" value={this.link}/> <br />
        <textarea name="description" placeholder="description"></textarea>
        <br />
        <input type="submit" value="Save" />
      </form>
    );
  }
});

var LinkList = React.createClass({
  getInitialState: function() {
    return {links: []};
  },

  handleSubmit: function(title, link, description) {
    var nextLinks = this.state.links.concat([{
      title: title,
      link: link,
      description: description
    }]);
    this.setState({links: nextLinks});
  },

  render: function() {
    return (
      <section>
        <LinksBox links={this.state.links} />
        <AddLinkForm onLinkSubmit={this.handleSubmit} />
      </section>
    );
  }
});
React.render(
  <LinkList />,
  document.getElementById('content')
);