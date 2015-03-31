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
  },
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
          onBlur={this.fetchTitle} onChange={this.updateTitle} value={this.state.title}/>
        <input type="text" name="link" value={this.state.link} hidden/> <br />
        <textarea name="description" placeholder="description" onChange={this.updateDescription} value={this.state.description}/>
        <button>Save</button>
      </form>
    );
  }
});

var LinkList = React.createClass({
  getInitialState: function() {
    return {links: []};
  },
  handleSubmit: function(newLink) {
    var nextLinks = this.state.links.concat([newLink]);
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