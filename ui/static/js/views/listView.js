import {createSong, fetchSongs} from "../api.js";
import {navigate} from "../router.js";
import {createDiv, createSpan} from "../utils/helpers.js";
import {NOTEBOOK_LINE_CLASS} from "../main.js";

export async function showListView() {
    document.getElementById('list-view').style.display = 'block'
    document.getElementById('edit-view').style.display = 'none'

    const container = document.getElementById('songs-container');
    container.innerHTML = '';

    await renderSongList();
}

async function renderSongList() {
    const result = await fetchSongs();

    const container = document.getElementById('songs-container');

    for (let song of result.songs) {
        const div = createDiv(NOTEBOOK_LINE_CLASS);
        const span = createSpan('hover-effect', song.title);
        span.setAttribute("data-id", song.id)
        span.addEventListener("click", handleSongClick);

        div.appendChild(span);
        container.appendChild(div);
    }
}

function handleSongClick(event) {
    const songId = event.target.getAttribute('data-id')
    navigate(`/songs/${songId}`);
}

export async function newSong() {
    const title = 'Untitled'
    const lyrics = ''

    const result = await createSong(title, lyrics);
    const newSongId = result.song.id;
    navigate(`/songs/${newSongId}`);
}