import {newFetchError} from "./utils/helpers.js";

const API_BASE_URL = 'http://localhost:4000';

export async function fetchSongs() {
    const response = await fetch(`${API_BASE_URL}/v1/songs`, {
        headers: {'Authorization': `Bearer ${localStorage.getItem('authToken')}`}
    });
    const result = await response.json()

    if (!response.ok) throw newFetchError(response, result);
    return result;
}

export async function fetchSong(id) {
    const response = await fetch(`${API_BASE_URL}/v1/songs/${id}`, {
        headers: {'Authorization': `Bearer ${localStorage.getItem('authToken')}`}
    });
    const result = await response.json()

    if (!response.ok) throw newFetchError(response, result);
    return result;
}

export async function createSong(title, lyrics) {
    const response = await fetch(`${API_BASE_URL}/v1/songs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ title, lyrics })
    });
    const result = await response.json()

    if (!response.ok) throw newFetchError(response, result);
    return result;
}

export async function updateSong(id, title, lyrics) {
    const response = await fetch(`${API_BASE_URL}/v1/songs/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ title, lyrics })
    });
    const result = await response.json()

    if (!response.ok) throw newFetchError(response, result);
    return result;
}

export async function deleteSong(id) {
    const response = await fetch(`${API_BASE_URL}/v1/songs/${id}`, {
        method: 'DELETE',
        headers: {'Authorization': `Bearer ${localStorage.getItem('authToken')}`}
    });
    const result = await response.json()

    if (!response.ok) throw newFetchError(response, result);
    return result;
}

export async function registerUser(name, email, password) {
    const response = await fetch(`${API_BASE_URL}/v1/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    const result = await response.json()

    if (!response.ok) throw newFetchError(response, result);
    return result;
}

export async function activateUser(token) {
    const response = await fetch(`${API_BASE_URL}/v1/users/activated`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    });
    const result = await response.json()

    if (!response.ok) throw newFetchError(response, result);
    return result;
}

export async function fetchAuthenticationToken(email, password) {
    const response = await fetch(`${API_BASE_URL}/v1/tokens/authentication`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const result = await response.json()

    if (!response.ok) throw newFetchError(response, result);
    return result;
}