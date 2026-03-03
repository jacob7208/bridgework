import {type Song, type User, type Token, FetchError} from "../types";

export async function fetchSongs(): Promise<Song[]> {
    const response = await fetch(`/v1/songs`, {
        headers: {'Authorization': `Bearer ${localStorage.getItem('authToken')}`}
    });
    const result = await response.json();

    if (!response.ok) throw new FetchError(response, result);
    return result.songs;
}

export async function fetchSong(id: number): Promise<Song> {
    const response = await fetch(`/v1/songs/${id}`, {
        headers: {'Authorization': `Bearer ${localStorage.getItem('authToken')}`}
    });
    const result = await response.json();

    if (!response.ok) throw new FetchError(response, result);
    return result.song;
}

export async function createSong(title: string, lyrics: string): Promise<Song> {
    const response = await fetch(`/v1/songs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ title, lyrics })
    });
    const result = await response.json();

    if (!response.ok) throw new FetchError(response, result);
    return result.song;
}

export async function updateSong(id: number, title: string, lyrics: string): Promise<Song> {
    const response = await fetch(`/v1/songs/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ title, lyrics })
    });
    const result = await response.json();

    if (!response.ok) throw new FetchError(response, result);
    return result.song;
}

export async function deleteSong(id: number):Promise<string> {
    const response = await fetch(`/v1/songs/${id}`, {
        method: 'DELETE',
        headers: {'Authorization': `Bearer ${localStorage.getItem('authToken')}`}
    });
    const result = await response.json();

    if (!response.ok) throw new FetchError(response, result);
    return result.message;
}

export async function registerUser(name: string, email: string, password: string): Promise<User> {
    const response = await fetch(`/v1/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    const result = await response.json();

    if (!response.ok) throw new FetchError(response, result);
    return result.user;
}

export async function activateUser(token: string): Promise<User> {
    const response = await fetch(`/v1/users/activated`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    });
    const result = await response.json();

    if (!response.ok) throw new FetchError(response, result);
    return result;
}

export async function fetchAuthenticationToken(email: string, password: string): Promise<Token> {
    const response = await fetch(`/v1/tokens/authentication`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const result = await response.json();

    if (!response.ok) throw new FetchError(response, result);
    return result.authentication_token;
}

export async function logoutUser(): Promise<string> {
    const response = await fetch(`/v1/tokens/authentication`, {
        method: 'DELETE',
        headers: {'Authorization': `Bearer ${localStorage.getItem('authToken')}`}
    });
    const result = await response.json();

    if (!response.ok) throw new FetchError(response, result);
    return result.message;
}

export async function fetchCurrentUser(): Promise<User> {
    const response = await fetch(`/v1/users/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
    });
    const result = await response.json();

    if (!response.ok) throw new FetchError(response, result);
    return result.user as User;
}