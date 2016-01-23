var axios = require('axios');

//Collections
export function getCollections() {
    return axios.get('/api/collections');
}

export function createCollection(newCollection) {
    return axios.put('/api/collection', newCollection);
}

export function updateCollectionTitle(data) {
    return axios.post('/api/collection', data);
}

export function deleteCollection(collectionId) {
    return axios.delete(`/api/collection/${collectionId.id}`);
}

//Links
export function getLinks(collectionId) {
    return axios.get(`/api/collection/${collectionId.id}`);
}

export function createLink(link) {
    return axios.put('/api/link', link);
}

export function updateLink(link) {
    return axios.post('/api/link', link);
}

export function deleteLink(link) {
    return axios.delete('/api/link', {data: link});
}

//Auth
export function signup(newUser) {
    return axios.put('/api/user', newUser);
}

export function login(user) {
    return axios.post('/login', user);
}

export function isLoggedIn() {
    return true;
}