import React from 'react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import './signInButton.css';

const signInButton = ({status, clickHandler, text}) => {
  const btnClasses = ClassNames('sign__in__button')

  return (
    <button
      className={btnClasses}
      onClick={() => clickHandler()}
      >
      <span>{text}</span>
    </button>
  );
};

signInButton.propTypes = {
  status: PropTypes.string,
  clickHandler: PropTypes.func,
  text: PropTypes.string
};

export default signInButton;
