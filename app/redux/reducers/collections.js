import * as Actions from '../actions/actionTypes';

const initialState = {
  list: [],
  map: {},
  error: null,
};

const sorter = (a, b) => a.createdAt - b.createdAt;

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.FORK_COLLECTION:
    case Actions.UPDATE_COLLECTION:
    case Actions.GET_COLLECTION:
    case Actions.ADD_COLLECTION: {
      const newList = state.list.concat([action.collection]).sort(sorter);
      const newMap = { ...state.map };
      newMap[action.collection.postId] = action.collection;
      return { list: newList, map: newMap };
    }
    case Actions.DELETE_COLLECTION: {
      let i;
      for (i = 0; i < state.list.length; i += 1) {
        if (state.list[i]._id === action.id) {
          break;
        }
      }
      const newMap = { ...state.map };
      delete newMap[state.list[i].postId];
      const newList = [].concat(state.list);
      newList.splice(i, 1);
      return {
        list: newList,
        map: newMap
      };
    }
    case Actions.GET_COLLECTIONS: {
      const map = {};
      action.collections.forEach((el) => {
        map[el.postId] = el;
      });
      return {
        list: action.collections.sort(sorter),
        map
      };
    }
    case Actions.COLLECTION_ERROR: {
      if (typeof action.err === 'string') {
        return { ...state, error: action.err };
      }
      return { ...state, error: action.err.response.data.message };
    }
    case Actions.CLEAR_COLLECTION_ERROR: {
      return { ...state, error: null };
    }
    default:
      return state;
  }
}
