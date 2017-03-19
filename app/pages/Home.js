import React from 'react';
import { Link } from 'react-router';

const home = (props) => {
  return (
    <div className="homeStyle">
      <p>Suplmntl is an easy way to annotate and share links.</p>
      <ul className="hero">
        <li>
          Had a great conversation where you mentioned tons of things you&apos;ve
          been reading? Compile and share them with Suplmntl.
        </li>
        <li>Gathering sources for a paper you&apos;re writing? Collect and organize them with Suplmntl.</li>
      </ul>
      <Link className="headerLink" to="sign-up">Sign Up</Link>
    </div>
  );
};

export default home;
