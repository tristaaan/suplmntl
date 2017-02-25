import * as Actions from '../actions/auth';

const initialState = {
  token: '',
  user: null,
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

    case Actions.LOGIN_ERROR: {
      console.error('There was an error logging in: ', action.err);
      return state;
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
