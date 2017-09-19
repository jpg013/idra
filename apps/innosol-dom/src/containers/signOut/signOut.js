import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { signOut } from '../../store/actions/auth';

class SignOut extends Component {
  componentWillMount() {
    this.props.signOutUser();
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' }};
    if (!this.props.isAuthenticated) {
      return ( <Redirect to={from} /> );
    }
    return null;
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.status === 'authenticated'
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signOutUser: () => dispatch(signOut())
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignOut));
