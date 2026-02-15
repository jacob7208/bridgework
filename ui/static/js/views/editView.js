import {fetchSong, updateSong} from "../api.js";
import {
    currentSongId, LYRIC_EDITOR,
    setCurrentSongId, SONG_CONTAINER, TITLE_INPUT,
} from "../main.js";
import {createDiv, createInput, debounce, handleAPIError} from "../utils/helpers.js";
import {navigate} from "../router.js";

let titleInput;
let lyricEditor;
let statusElement;

const dSaveSong = debounce(saveSong, 1000);

const editorState = {
    title: '',
    lyrics: [],
}

export async function showEditView(songId) {
    document.getElementById('list-view').style.display = 'none';
    document.getElementById('edit-view').style.display = 'block';

    await renderSong(songId)
    setCurrentSongId(songId)
}

// === Render Functions ===

async function renderSong(songId) {
    try {
        const result = await fetchSong(songId);

        editorState.title = result.song.title;
        editorState.lyrics = (result.song.lyrics || '').split('\n');

        initEditorDOM();
        attachEventHandlers(lyricEditor, titleInput);
        renderTitle();
        renderLyrics();
    } catch (error) {
        handleAPIError(error);
        console.error("Song not found:", error);
        navigate("/app/songs")
    }
}

function initEditorDOM() {
    const songContainer = document.getElementById(SONG_CONTAINER);
    songContainer.innerHTML = '';

    titleInput = createInput(TITLE_INPUT, TITLE_INPUT, 'text');
    titleInput.maxLength = 50;
    titleInput.placeholder = 'Untitled';

    lyricEditor = createDiv(LYRIC_EDITOR, LYRIC_EDITOR);
    lyricEditor.contentEditable = 'true';
    lyricEditor.spellcheck = false;

    songContainer.appendChild(titleInput);
    songContainer.appendChild(lyricEditor);

    statusElement = document.getElementById('save-status');
}

function renderTitle() {
    titleInput.value = editorState.title;
}

function renderLyrics() {
    lyricEditor.innerHTML = '';

    editorState.lyrics.forEach(line => {
        const p = document.createElement('p');
        p.textContent = line;
        lyricEditor.appendChild(p);
        });

    if (!lyricEditor.children.length) {
        lyricEditor.appendChild(document.createElement('p'));
    }
}

function attachEventHandlers(editor, titleInput) {
    editor.addEventListener('input', () => {
        editorState.lyrics = [...editor.children].map(p => p.textContent);
        scheduleSave();
    })

    editor.addEventListener('paste', e => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text.replace(/\r\n/g, '\n'))
    })

    titleInput.addEventListener('input', () => {
        editorState.title = titleInput.value;
        if (!titleInput.value) editorState.title = 'Untitled';
        scheduleSave();
    })
}

// === Backend Integration ===

async function saveSong(songId) {
    try {
       await updateSong(songId, editorState.title, editorState.lyrics.join('\n'));
       statusElement.textContent = "Saved";
   } catch (error) {
        handleAPIError(error);
        statusElement.textContent = "Error";
        console.log(error);
   }
}

export function scheduleSave() {
    statusElement.textContent = "Saving...";
    dSaveSong(currentSongId);
}