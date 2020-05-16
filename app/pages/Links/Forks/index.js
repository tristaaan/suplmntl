// ForkView
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { getForks, getCollectionByPostId } from '../../../service';

function ForksView(props) {
  const [forks, setForks] = useState([]);

  useEffect(() => {
    getForks(props.match.params.id)
      .then((resp) => {
        setForks(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [name, setName] = useState('');
  useEffect(() => {
    getCollectionByPostId(props.match.params.id)
      .then((resp) => {
        setName(resp.data.name);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="fork-list">
      <div className="linkListTitle">
        <h1>
          Forks of&nbsp;
          <Link to={`/${props.match.params.user}/${props.match.params.id}/view`}>
            {name}
          </Link>
        </h1>
      </div>
      <ul>
        {
          forks.map((el) => (
            <li key={el._id}>
              <Link to={`/${el.owner.username}/${el.postId}/view`}>
                { `${el.owner.username} / ${el.name}` }
              </Link>
            </li>
          ))
        }
      </ul>
    </div>
  );
}

ForksView.propTypes = {
  match: PropTypes.object
};

export default ForksView;
