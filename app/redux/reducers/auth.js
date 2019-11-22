import * as Actions from '../actions/actionTypes';

const initialState = {
  token: '',
  user: null,
  error: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.LOGIN_SUCCESS: {
      return {
        user: action.user,
        token: action.token
      };
    }

    case Actions.LOGOUT: {
      return initialState;
    }

    case Actions.AUTH_ERROR: {
      if (typeof action.err === 'string') {
        return { error: action.err, ...state };
      }
      return { error: action.err.response.data.message, ...state };
    }

    case Actions.CLEAR_ERROR: {
      return { error: null, ...state };
    }

    case Actions.UPDATE_USER: {
      const newState = { ...state };
      newState.user = action.user;
      return newState;
    }

    default:
      return state;
  }
}
