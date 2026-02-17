import './api.js'
import './router.js'
import './views/editView.js'
import './views/listView.js'
import './utils/helpers.js'

import {setViewHandlers, navigate} from "./router.js";
import {showListView, newSong} from "./views/listView.js";
import {showEditView} from "./views/editView.js";
import {deleteSong, logoutUser} from "./api.js";
import {handleAPIError} from "./utils/helpers.js";

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
                try {
                    await deleteSong(currentSongId);
                } catch (error) {
                    handleAPIError(error);
                    console.log('Failed to delete song:', error)
                }

            }
            navigate('/app/songs');
        });
    }

    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => navigate('/app/songs'));
    }

    const newBtn = document.getElementById('new-btn');
    if (newBtn) {
        newBtn.addEventListener('click', () => newSong());
    }

    const logoutBtn = document.getElementById('log-out-btn')
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await logoutUser();
                localStorage.removeItem('authToken');
                window.location.href = '/login'
            } catch (error) {
                handleAPIError(error);
                console.error("Unable to log out:", error);
            }
        })
    }
});
