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

    default:
      return state;
  }
}
