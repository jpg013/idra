import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, withRouter } from 'react-router-dom';

class AdminRoute extends Component {
  redirectToHome() {
    return (
      <Redirect to={{
        pathname: '/',
        state: { from: this.props.location }
      }}/>
    );
  }
  
  renderRouteComponent() {
    if (this.props.isAdmin) {
      return this.props.component;
    } else {
      return this.redirectToHome.bind(this);
    }
  };
  
  render() {
    return (
      <Route render={this.renderRouteComponent()}/>
    );
  }
}

const mapStateToProps = state => {
  const user = state.auth.user || {};
  return {
    isAdmin: user.role === 'admin'
  };
};

export default withRouter(connect(mapStateToProps)(AdminRoute));
