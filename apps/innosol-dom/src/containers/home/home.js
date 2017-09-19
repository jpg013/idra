import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Board from '../../common/board/board';
import './home.css';

class Home extends Component {
  componentWillMount() {

  }

  render() {
    return (
      <Board>
        <div className="home">
          hello world
        </div>
      </Board>
    );
  }
}

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return {

  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
