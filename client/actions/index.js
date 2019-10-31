import { postFetch } from './utils.js';
import axios from 'axios';

const GET_USER = Symbol('GET_USER');

const getUserActionCreator = user => ({
  type: GET_USER,
  user,
});

const getUser = () => dispatch => {
  axios.get('/api/user')
    .then(axRes => {
      dispatch(getUserActionCreator(axRes.data));
    })
    .then(err => {
      console.error(err.response);
    });
};

export {
  GET_USER,
  getUser,
}
