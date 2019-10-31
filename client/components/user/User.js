import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'
import { getUser } from '../../actions/index.js';
import styles from './styles.js';

class User extends Component {
  componentDidMount() {
    const { onLoad } = this.props;

    onLoad();
  }

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
  onLoad: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user || {},
});

const mapDispatchToProps = dispatch => ({
  onLoad: () => dispatch(getUser()),
});

const ConnectedUser = withRouter(connect(mapStateToProps, mapDispatchToProps)(User));

export default ConnectedUser;
