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
          style={{
            whiteSpace: 'pre-wrap',
            overflowX: 'scroll',
            color: 'lightgreen',
            maxWidth: '100%',
          }}
        >
          { JSON.stringify(user, null, 2) }
        </pre>
        <button>
          Logout
        </button>
      </div>
    )
  }
}



User.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.user || {},
});

const mapDispatchToProps = (dispatch) => ({
  onLoad: () => dispatch(getUser()),
});

const ConnectedUser = withRouter(connect(mapStateToProps, mapDispatchToProps)(User));

export default ConnectedUser;
