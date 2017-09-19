import React from 'react';
import './signInInput.css';

const signInInput = ({children, inputType, changeHandler, placeHolder}) => {
  return (
    <div className='sign__in__input'>
      <div className="sign__in__input__container">
        <div className="sign__in__input__icon">
          {children}
        </div>
        <input
          className="sign__in__input--input"
          type={inputType}
          placeholder={placeHolder}
          onChange={changeHandler}
        />
      </div>
    </div>
  );
};

signInInput.propTypes = {

};

export default signInInput;
