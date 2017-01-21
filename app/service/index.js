import Axios from 'axios';

const axios = Axios.create({ baseURL: '/api' });

export function upadteAuthToken(token) {
  axios.defaults.headers.common.Authorization = token;
}

// Collections
export function getCollections(username) {
  return axios.get(`/collections?username=${username}`);
}

export function getCollection(collectionId) {
  return axios.get(`/collection/${collectionId}`);
}

export function createCollection(newCollection) {
  return axios.put('/collection', newCollection);
}

export function updateCollection(collection) {
  return axios.post('/collection', { collection });
}

export function deleteCollection(collectionId) {
  return axios.delete(`/collection/${collectionId}`);
}

export function forkCollection(id) {
  return axios.post(`/collection/${id}/fork`, { id });
}

// Auth
export function signup(newUser) {
  return axios.put('/user', newUser);
}

export function login(user) {
  return axios.post('/login', user);
}

export function getUser(token) {
  return axios.get('user');
}
