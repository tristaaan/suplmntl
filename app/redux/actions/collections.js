import * as service from '../../service';

export const ADD_COLLECTION = 'ADD_COLLECTION';
export const DELETE_COLLECTION = 'DELETE_COLLECTION';
export const UPDATE_COLLECTION = 'UPDATE_COLLECTION';
export const GET_COLLECTIONS = 'GET_COLLECTIONS';
export const GET_COLLECTION = 'GET_COLLECTION';

export function addCollection(collection) {
  return (dispatch) => {
    service.createCollection(collection)
      .then((resp) => {
        return { type: ADD_COLLECTION, collection: resp };
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function deleteCollection(id) {
  return (dispatch) => {
    service.deleteCollection(id)
      .then((resp) => {
        return { type: DELETE_COLLECTION, id };
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function updateCollection(collection) {
  return (dispatch) => {
    service.updateCollection(collection)
      .then((resp) => {
        return { type: UPDATE_COLLECTION, collection: resp.data };
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function getCollections(username) {
  return (dispatch) => {
    service.getCollections(username)
      .then((resp) => {
        dispatch({ type: GET_COLLECTIONS, collections: resp.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function getCollection(id) {
  return (dispatch) => {
    service.getCollection(id)
      .then((resp) => {
        return { type: GET_COLLECTIONS, collection: resp.data };
      })
      .catch((err) => {
        console.log(err);
      });
  };
}
