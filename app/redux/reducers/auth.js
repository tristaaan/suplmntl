import * as Actions from '../actions/auth';

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
      console.log('an error:', action.err);
      return Object.assign({}, state, { error: action.err.response.data.message });
    }

    case Actions.CLEAR_ERROR: {
      return Object.assign({}, state, { error: null });
    }

    case Actions.UPDATE_USER: {
      const newState = Object.assign({}, state);
      newState.user = action.user;
      return newState;
    }

    default:
      return state;
  }
}
