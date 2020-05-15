// ForkView
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { getForks } from '../../../service';

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

  return (
    <ul>
      {
        forks.map((el) => (
          <li>
            <Link to={`/${el.owner.username}/${el.postId}/view`}>
              { el.name }
            </Link>
          </li>
        ))
      }
    </ul>
  );
}

ForksView.propTypes = {
  match: PropTypes.object,
};

export default ForksView;
