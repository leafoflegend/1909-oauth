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

      </div>
    );
  }
}

Home.propTypes = {};

const mapStateToProps = ({}) => ({});

const mapDispatchToProps = (dispatch, { history }) => ({});

const ConnectedHome = withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));

export default ConnectedHome;
