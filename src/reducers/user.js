import { combineReducers } from 'redux'
import * as types from '../static/_types';

const user = (state = null, action) => {
  switch (action.type) {
    case action.type === 'SET_USER':
      state = action.payload;
      return action.payload || null;
    case types.LOGOUT_USER:
      return null;
    default:
      return state
  }
};

export default combineReducers({
  user,
})
