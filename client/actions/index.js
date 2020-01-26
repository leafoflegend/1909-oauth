import axios from 'axios';
import { postFetch } from './utils.js';

const GOT_USER = 'GOT_USER';

const gotUser = user => ({
  type: GOT_USER,
  user,
});

const getUser = () => dispatch => {
  axios.get('/api/github/user')
    .then(res => {
      dispatch(gotUser(res.data));
    })
    .catch(e => {
      console.error(e);
    });
};

export {
  getUser,
  gotUser,
  GOT_USER,
};

