import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';

function Main({ children }) {
  return (
    <div>
      <Header />
      <div>
        { children }
      </div>
    </div>
  );
}

Main.propTypes = {
  children: PropTypes.object
};

export default Main;
