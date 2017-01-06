//LinkList
import React from 'react';
import ReactDOM from 'react-dom';
import Dropdown from '../../Dropdown';
import LinksBox from './LinkBox';
import * as service from '../../../service';

export default React.createClass({
  displayName: 'ViewLinks',
  getInitialState() {
    return {links: [], name: '', renaming: false};
  },
  contextTypes: {
    router: React.PropTypes.object,
  },
  componentDidMount(){
    var id = this.props.params.id;
    service.getLinks(id)
      .then((resp) => {
        this.setState({id: id, 
          name: resp.data.name,
          links: resp.data.items});
      })
      .catch((error) => {
        console.error(error.message);
      });
  },
  editList() {
    this.context.router.push(`/list/${this.state.id}/edit`);
  },
  render() {
    return (
      <section id="linkList">
        <div className="linkListHeader">
          <h1>{this.state.name}</h1>
          <Dropdown buttonText="#">
            <ul className="dropdown-list">
              { true ? <li onClick={this.editList}>Edit List</li> : <li onClick={() => {console.log('fork');}}>Fork List</li>}
              <li onClick={() => {console.log('star');}}>Star List</li>
            </ul>
          </Dropdown>
        </div>
        <LinksBox links={this.state.links} />
      </section>
    );
  }
});