import history from '../../history';

import * as service from '../../service';
import * as Actions from './actionTypes';

export function clearError() {
  return { type: Actions.CLEAR_COLLECTION_ERROR };
}

export function addCollection(collection) {
  return (dispatch) => {
    service.createCollection(collection)
      .then((resp) => {
        dispatch({ type: Actions.ADD_COLLECTION, collection: resp.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function deleteCollection(id, location = null) {
  return (dispatch) => {
    service.deleteCollection(id)
      .then((resp) => {
        if (location) {
          history.replace(location);
        }
        dispatch({ type: Actions.DELETE_COLLECTION, id });
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function updateCollection(collection) {
  return (dispatch) => {
    service.updateCollection(collection)
      .catch((err) => {
        console.log(err);
      });
    dispatch({ type: Actions.UPDATE_COLLECTION, collection });
  };
}

export function getCollections(username) {
  return (dispatch) => {
    service.getCollections(username)
      .then((resp) => {
        dispatch({ type: Actions.GET_COLLECTIONS, collections: resp.data });
        dispatch({ type: Actions.COLLECTION_ERROR });
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          dispatch({ type: Actions.COLLECTION_ERROR, err: err.response.data });
        }
        // console.log(err);
      });
  };
}

export function getCollection(id) {
  return (dispatch) => {
    service.getCollection(id)
      .then((resp) => {
        dispatch({ type: Actions.GET_COLLECTION, collection: resp.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function forkCollection(id, user) {
  return (dispatch) => {
    service.forkCollection(id)
      .then((resp) => {
        history.push(`/list/${resp.data.postId}/view`);
        dispatch({ type: Actions.FORK_COLLECTION, collection: resp.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };
}
