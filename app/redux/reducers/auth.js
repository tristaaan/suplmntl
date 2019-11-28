import * as Actions from '../actions/actionTypes';

const initialState = {
  token: '',
  user: null,
  error: null,
  passChangeMessage: '',
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
      return { ...initialState };
    }

    case Actions.AUTH_ERROR: {
      if (typeof action.err === 'string') {
        return { ...state, error: action.err };
      }
      return { ...state, error: action.err.response.data.message };
    }

    case Actions.CLEAR_ERROR: {
      return { ...state, error: null };
    }

    case Actions.UPDATE_USER: {
      const newState = { ...state };
      newState.user = action.user;
      return newState;
    }

    case Actions.PASS_CHANGE: {
      return { ...state, passChangeMessage: action.message };
    }

    case Actions.CLEAR_MESSAGE: {
      return { ...state, passChangeMessage: '' };
    }

    default:
      return state;
  }
}
