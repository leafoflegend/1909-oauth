import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'
import { onLogOut } from '../actions/index.js';

class User extends Component {
  render() {
    const { user } = this.props;
    return (
      <>
        { JSON.stringify(user) }
      </>
    )
  }
}

User.propTypes = {};

const mapStateToProps = state => ({
  user: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.object,
  ]).isRequired,
});

const mapDispatchToProps = (dispatch, { history }) => ({});

const ConnectedUser = withRouter(connect(mapStateToProps, mapDispatchToProps)(User));

export default ConnectedUser;
