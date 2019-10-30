const initialState = {
  user: null,
};

const rootReducer = (state = initialState, action) => {
  if (typeof action !== 'object' || !action.type) return state;

  switch(action.type) {
    default:
      return state;
  }
};

export default rootReducer;
