import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import styles from './styles.js';

class Home extends Component {
  render() {
    const {} = this.props;

    return (
      <div
        style={styles.pageContainer}
      >
        <h1> Our cool OAUTH App. </h1>
        <a href={"/api/github/login"}> Login to Github here! </a>
      </div>
    );
  }
}

Home.propTypes = {};

const mapStateToProps = ({}) => ({});

const mapDispatchToProps = (dispatch, { history }) => ({});

const ConnectedHome = withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));

export default ConnectedHome;
