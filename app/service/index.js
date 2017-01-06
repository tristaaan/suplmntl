import Axios from 'axios';

const axios = Axios.create({ baseURL: '/api' });

export function upadteAuthToken(token) {
    axios.defaults.headers.common['Authorization'] = token;
}

//Collections
export function getCollections(username) {
    return axios.get(`/collections?username=${username}`);
}

export function createCollection(newCollection) {
    return axios.put('/collection', newCollection);
}

export function updateCollectionTitle(data) {
    return axios.post('/collection', data);
}

export function deleteCollection(collectionId) {
    return axios.delete(`/collection/${collectionId.id}`);
}

//Links
export function getLinks(collectionId) {
    return axios.get(`/collection/${collectionId.id}`);
}

export function createLink(link) {
    return axios.put('/link', link);
}

export function updateLink(link) {
    return axios.post('/link', link);
}

export function deleteLink(link) {
    return axios.delete('/link', {data: link});
}

//Auth
export function signup(newUser) {
    return axios.put('/user', newUser);
}

export function login(user) {
    return axios.post('/login', user);
}

export function getUser(token) {
    return axios.get('user');
}