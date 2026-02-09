import {createSong, fetchSongs} from "../api.js";
import {navigate} from "../router.js";
import {createDiv, createInput, createSpan} from "../utils/helpers.js";
import {NOTEBOOK_LINE, SONGS_CONTAINER, TITLE_INPUT} from "../main.js";

let songsContainer;

export async function showListView() {
    document.getElementById('list-view').style.display = 'block'
    document.getElementById('edit-view').style.display = 'none'

    songsContainer = document.getElementById(SONGS_CONTAINER);
    songsContainer.innerHTML = '';

    const titleInput = createInput(TITLE_INPUT, TITLE_INPUT, 'text');
    titleInput.value = 'My Songs'
    titleInput.maxLength = 50;
    titleInput.placeholder = 'My Songs';

    songsContainer.appendChild(titleInput);

    await renderSongList();
}

async function renderSongList() {
    const result = await fetchSongs();

    for (let song of result.songs) {
        const div = createDiv(NOTEBOOK_LINE, NOTEBOOK_LINE);
        const span = createSpan('hover-effect', song.title);
        span.setAttribute("data-id", song.id)
        span.addEventListener("click", handleSongClick);

        div.appendChild(span);
        songsContainer.appendChild(div);
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