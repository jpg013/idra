import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, withRouter } from 'react-router-dom';

class AuthorizedRoute extends Component {
  redirectToSignIn = () => {
    const redirectArgs = {
      pathname: '/signin',
      state: { from: this.props.location }
    };

    return (
      <Redirect to={redirectArgs} />
    );
  }

  renderRouteComponent() {
    if (this.props.isAuthenticated) {
      return this.props.component;
    } else if (this.props.location.pathname === '/signin') {
      return null;
    } else {
      return this.redirectToSignIn;
    }
  };

  render() {
    return (
      <Route render={this.renderRouteComponent()}/>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.status === 'authenticated'
  };
};

export default withRouter(connect(mapStateToProps)(AuthorizedRoute));
