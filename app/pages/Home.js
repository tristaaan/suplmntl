import React from 'react';
import { Link } from 'react-router';

const home = (props) => {
  return (
    <div className="homeStyle">
      <p>A tool to supplement your notes, conversations, and life.</p>
      <Link className="headerLink" to="sign-up">Sign Up</Link>
    </div>
  );
};

export default home;
