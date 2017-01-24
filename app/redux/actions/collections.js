import * as service from '../../service';
import { hashHistory } from 'react-router';

export const ADD_COLLECTION = 'ADD_COLLECTION';
export const DELETE_COLLECTION = 'DELETE_COLLECTION';
export const FORK_COLLECTION = 'FORK_COLLECTION';
export const UPDATE_COLLECTION = 'UPDATE_COLLECTION';
export const GET_COLLECTIONS = 'GET_COLLECTIONS';
export const GET_COLLECTION = 'GET_COLLECTION';

export function addCollection(collection) {
  return (dispatch) => {
    service.createCollection(collection)
      .then((resp) => {
        dispatch({ type: ADD_COLLECTION, collection: resp.data });
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
          hashHistory.replace(location);
        }
        dispatch({ type: DELETE_COLLECTION, id });
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
        dispatch({ type: UPDATE_COLLECTION, collection });
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
        dispatch({ type: GET_COLLECTION, collection: resp.data });
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
        hashHistory.push(`/list/${resp.data.postId}/view`);
        dispatch({ type: FORK_COLLECTION, collection: resp.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

