import './api.js'
import './router.js'
import './views/editView.js'
import './views/listView.js'
import './utils/dom.js'
import './utils/textEditor.js'

import {setViewHandlers, navigate} from "./router.js";
import {showListView, newSong} from "./views/listView.js";
import {showEditView} from "./views/editView.js";
import {deleteSong} from "./api.js";

export let NOTEBOOK_LINE_CLASS = 'notebook-line'
export let TITLE_INPUT_CLASS = 'title-input'
export let LYRIC_INPUT_CLASS = 'lyric-input'

export let currentSongId = null;
export function setCurrentSongId(id) {
    currentSongId = id;
}

setViewHandlers(showListView, showEditView)

window.addEventListener('DOMContentLoaded', () => {
    const deleteBtn = document.getElementById('delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (currentSongId) deleteSong(currentSongId);
            navigate('/')
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
