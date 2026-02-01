const API_BASE_URL = 'http://localhost:4000';

export async function fetchSongs() {
    const response = await fetch(`${API_BASE_URL}/v1/songs`);
    if (!response.ok) throw new Error(`Failed to fetch songs: ${response.status}`);
    return response.json();
}

export async function fetchSong(id) {
    const response = await fetch(`${API_BASE_URL}/v1/songs/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch song: ${response.status}`);
    return response.json();
}

export async function createSong(title, lyrics) {
    const response = await fetch(`${API_BASE_URL}/v1/songs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, lyrics })
    });
    if (!response.ok) throw new Error(`Failed to create song: ${response.status}`);
    return response.json();
}

export async function updateSong(id, title, lyrics) {
    const response = await fetch(`${API_BASE_URL}/v1/songs/${id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ title, lyrics })
    });
    if (!response.ok) throw new Error(`Failed to update song: ${response.status}`);
    return response.json();
}

export async function deleteSong(id) {
    const response = await fetch(`${API_BASE_URL}/v1/songs/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error(`Failed to delete song: ${response.status}`);
    return response.json();
}