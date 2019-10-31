import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'
import {} from '../../actions/index.js';
import './styles.js';

class User extends Component {
  render() {
    const { user } = this.props;
    return (
      <div style={styles.pageContainer}>
        <pre
          style={styles.codeContainer}
        >
          { JSON.stringify(user, null ,2) }
        </pre>
      </div>
    )
  }
}

User.propTypes = {
  user: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.object,
  ]).isRequired,
};

const mapStateToProps = state => ({
  user: {},
});

const mapDispatchToProps = dispatch => ({});

const ConnectedUser = withRouter(connect(mapStateToProps, mapDispatchToProps)(User));

export default ConnectedUser;
