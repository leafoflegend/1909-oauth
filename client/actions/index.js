import { postFetch } from './utils.js';
import axios from 'axios';

const GET_USER = Symbol('GET_USER');

const getUserAction = user => ({
  type: GET_USER,
  user,
});

const getUser = () => dispatch => {
  axios.get('/api/user')
    .then(res => {
      dispatch(getUserAction(res.data));
    })
    .catch(err => {
      console.error('Error fetching user.', err);
    });
};

export {
  GET_USER,
  getUser,
}
