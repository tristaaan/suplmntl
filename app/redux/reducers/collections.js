import * as Actions from '../actions/collections';

const initialState = {
  list: [],
  map: {},
};

const sorter = (a, b) => a.createdAt - b.createdAt;

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.UPDATE_COLLECTION:
    case Actions.GET_COLLECTION:
    case Actions.ADD_COLLECTION: {
      const newList = state.list.concat([action.collection]).sort(sorter);
      const newMap = Object.assign({}, state.map);
      newMap[action.collection.id] = action.collection;
      return { list: newList, map: newMap };
    }
    case Actions.DELETE_COLLECTION: {
      let i;
      for (i = 0; i < state.list.length; i += 1) {
        if (state.list[i].id === action.id) {
          break;
        }
      }
      const newList = [].concat(state.list);
      newList.splice(i, 1);
      const newMap = Object.assign({}, state.map);
      delete newMap[action.id];
      return {
        list: newList,
        map: newMap
      };
    }
    case Actions.GET_COLLECTIONS: {
      const map = {};
      action.collections.forEach((el) => {
        map[el.id] = el;
      });
      return {
        list: action.collections.sort(sorter),
        map
      };
    }
    default:
      return state;
  }
}
