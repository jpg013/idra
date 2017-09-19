import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import SignInButton from './signInButton';
import SignInLogo from './signInLogo';
import SignInInput from './signInInput';
import { signInRequest } from '../../store/actions/auth';
import './signIn.css';

class SignIn extends Component {
  componentDidMount() {
    document.addEventListener('keydown', this.keyPressEventHandler);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyPressEventHandler);
  }

  handleSignIn = () => {
    if (!this.username || !this.password || this.props.status === 'authenticating') {
      return;
    }
    return this.props.signIn(this.username, this.password);
  }

  renderErrorMsg() {
    return (
      <div className="signIn__form__actions__msg">
        {this.props.status === 'error' && this.props.msg}
      </div>
    );
  }

  setUsername = e => {
    this.username = e.target.value;
  }

  setPassword = e => {
    this.password = e.target.value;
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' }};

    if (this.props.isAuthenticated) {
      return ( <Redirect to={from} /> );
    }

    const getBtnStatus = () => {
      if (this.props.status === 'error') {
        return 'error';
      }
      if (this.props.user) {
        return 'success';
      }
      if (this.props.status === 'authenticating') {
        return 'loading';
      }
    };

    return (
      <div className="signIn">
        <div className="signIn__container">
          <div className="signIn__logo__container">
            <SignInLogo />
          </div>
          <div className="signIn__form">
            <div className="signIn__form__body">

              <div className="signIn__form__body__inputs">
                <SignInInput
                  inputType="text"
                  changeHandler={this.setUsername}
                  placeHolder={'Username'}
                  >
                </SignInInput>
                <SignInInput
                  inputType="password"
                  changeHandler={this.setPassword}
                  placeHolder={'Password'}
                  >
                </SignInInput>
              </div>
            </div>

            <div className="signIn__form__actions">
              <div className="signIn__form__actions--btn">
                <SignInButton
                  status={getBtnStatus()}
                  clickHandler={this.handleSignIn}
                  text="Sign In" />
              </div>
              {this.renderErrorMsg()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SignIn.propTypes = {
  user: PropTypes.object,
  status: PropTypes.string,
  msg: PropTypes.string
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    isAuthenticated: state.auth.status === 'authenticated',
    status: state.auth.status,
    msg: state.auth.msg
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signIn: (username, password) => dispatch(signInRequest(username, password)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignIn));
