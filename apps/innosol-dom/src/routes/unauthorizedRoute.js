import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, withRouter } from 'react-router-dom';

class UnauthorizedRoute extends Component {
  redirectToHome = () => {
    return (
      <Redirect to={{
        pathname: '/',
        state: { from: this.props.location }
      }}/>
    );
  }

  renderRouteComponent() {
    if (!this.props.isAuthenticated) {
      return this.props.component;
    } else if (this.props.path === this.props.location.pathname) {
      return this.redirectToHome;
    }
    return null;
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

export default withRouter(connect(mapStateToProps)(UnauthorizedRoute));
