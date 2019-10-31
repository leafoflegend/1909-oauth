import { GET_USER } from '../actions/index.js';

const initialState = {
  user: null,
};

const rootReducer = (state = initialState, action) => {
  if (typeof action !== 'object' || !action.type) return state;

  switch(action.type) {
    case GET_USER:
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
};

export default rootReducer;
