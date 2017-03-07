import React from 'react';
import { Link } from 'react-router';

const home = (props) => {
  return (
    <div className="homeStyle">
      <p>Suplmntl is an easy way to annotate and share links.</p>
      <ul>
        <li>
          Had a great conversation where you mentioned tons of things you&apos;ve
          been reading, compile and share them with Suplmntl.
        </li>
        <li>Compiling sources for a paper you&apos;re writing, collect them with Suplmntl.</li>
      </ul>
      <Link className="headerLink" to="sign-up">Sign Up</Link>
    </div>
  );
};

export default home;
