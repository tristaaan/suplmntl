import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';

function Main(props) {
  return (
    <div>
      <Header />
      <div>
        { props.children }
      </div>
    </div>
  );
}

Main.propTypes = {
  children: PropTypes.object
};

export default Main;
