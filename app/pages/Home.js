import React from 'react';
import { Link } from 'react-router-dom';
import { resetTitle } from '../utils/setTitle';

function Home() {
  resetTitle();
  return (
    <div className="homeStyle">
      <p>Suplmntl is an easy way to annotate and share links.</p>
      <ul className="hero">
        <li>
          Had a great conversation where you mentioned tons of things you&apos;ve
          been reading? Compile and share them with Suplmntl.
        </li>
        <li>
          Gathering sources for a paper you&apos;re writing?&nbsp;
          Collect and organize them with Suplmntl.
        </li>
        <li>Quickly write and compose list based articles with Markdown export.</li>
      </ul>
      <Link className="headerLink" to="sign-up">Sign Up</Link>
    </div>
  );
}

export default Home;
