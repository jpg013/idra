import React from 'react';
import InnosolLogo from '../../components/innosolLogo/innosolLogo';
import './signInLogo.css';

const LoginLogo = () => (
  <div className="signIn__logo">
    <div className="signIn__logo__top">
      <InnosolLogo cssClass='signIn__logo__icon' cssDecorationClass='signIn__logo__decoration' />
    </div>
    <div className="signIn__logo__bottom">
      <span className="signIn__logo__label">Professionals</span>
    </div>
  </div>
);

export default LoginLogo;
