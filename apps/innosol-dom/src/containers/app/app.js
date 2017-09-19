import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch } from 'react-router-dom';
import SignOut from '../signOut/signOut';
import Home from '../home/home';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Switch>
          <Route path="/signout" component={SignOut} exact />
          <Route path="/" component={Home} exact />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
};

export default withRouter(connect(mapStateToProps)(App));
