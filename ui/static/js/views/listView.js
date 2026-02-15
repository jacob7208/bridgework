import {createSong, fetchSongs} from "../api.js";
import {navigate} from "../router.js";
import {createDiv, createInput, createSpan, handleAPIError} from "../utils/helpers.js";
import {NOTEBOOK_LINE, SONGS_CONTAINER, TITLE_INPUT} from "../main.js";

let songsContainer;

export async function showListView() {
    document.getElementById('list-view').style.display = 'block'
    document.getElementById('edit-view').style.display = 'none'

    songsContainer = document.getElementById(SONGS_CONTAINER);
    songsContainer.innerHTML = '';

    const titleDiv = createDiv('list-title', TITLE_INPUT);
    titleDiv.textContent = 'My Songs'

    songsContainer.appendChild(titleDiv);

    await renderSongList();
}

async function renderSongList() {
    try {
        const result = await fetchSongs();
        
        if (!result.songs) return;

        for (let song of result.songs) {
            const div = createDiv(NOTEBOOK_LINE, NOTEBOOK_LINE);
            const span = createSpan('hover-effect', song.title);
            span.setAttribute("data-id", song.id)
            span.addEventListener("click", handleSongClick);

            div.appendChild(span);
            songsContainer.appendChild(div);
        }
    } catch (error) {
        handleAPIError(error);
        console.error("Songs not found:", error);
        navigate("/")
    }
}

function handleSongClick(event) {
    const songId = event.target.getAttribute('data-id')
    navigate(`/app/songs/${songId}`);
}

export async function newSong() {
    const title = 'Untitled'
    const lyrics = ''

    try {
        const result = await createSong(title, lyrics);
        const newSongId = result.song.id;
        navigate(`/app/songs/${newSongId}`);
    } catch (error) {
        handleAPIError(error)
        console.error("Failed to create song:", error);
        navigate("/")
    }

}