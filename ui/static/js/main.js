import './api.js'
import './router.js'
import './views/editView.js'
import './views/listView.js'
import './utils/helpers.js'

import {setViewHandlers, navigate} from "./router.js";
import {showListView, newSong} from "./views/listView.js";
import {showEditView} from "./views/editView.js";
import {deleteSong} from "./api.js";

export let NOTEBOOK_LINE = 'notebook-line'
export let TITLE_INPUT = 'title-input'
export let LYRIC_EDITOR = 'lyric-editor'
export let SONG_CONTAINER = 'song-container'
export let SONGS_CONTAINER = 'songs-container'

export let currentSongId = null;

export function setCurrentSongId(id) {
    currentSongId = id;
}

setViewHandlers(showListView, showEditView)

window.addEventListener('DOMContentLoaded', () => {
    const deleteBtn = document.getElementById('delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
            if (currentSongId) {
                await deleteSong(currentSongId);
            }
            navigate('/');
        });
    }

    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => navigate('/'));
    }

    const newBtn = document.getElementById('new-btn');
    if (newBtn) {
        newBtn.addEventListener('click', () => newSong());
    }
});
