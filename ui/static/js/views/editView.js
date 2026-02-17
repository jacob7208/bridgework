import {fetchSong, updateSong} from "../api.js";
import {
    currentSongId, LYRIC_EDITOR,
    setCurrentSongId, SONG_CONTAINER, TITLE_INPUT,
} from "../main.js";
import {createDiv, createInput, debounce, handleAPIError} from "../utils/helpers.js";
import {navigate} from "../router.js";
import {lookupWord} from "../datamuse.js";

let titleInput;
let lyricEditor;
let statusElement;
let bookElement;
let perfRhymesDiv;
let nearRhymesDiv;
let synonymsDiv;

const editorState = {
    title: '',
    lyrics: [],
}

export async function showEditView(songId) {
    document.getElementById('list-view').style.display = 'none';
    document.getElementById('edit-view').style.display = 'block';

    await renderSong(songId);
    setCurrentSongId(songId);

    renderBook();
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
        navigate("/app/songs");
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
    bookElement = document.getElementById('book')
    perfRhymesDiv = document.getElementById('perfect-rhymes');
    nearRhymesDiv = document.getElementById('near-rhymes');
    synonymsDiv = document.getElementById('synonyms')

    perfRhymesDiv.innerHTML = '';
    nearRhymesDiv.innerHTML = '';
    synonymsDiv.innerHTML = '';
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

function renderBook() {
    const openBtn = document.querySelector(".book-open-btn");
    const closeBtn = document.querySelector(".book-close");

    openBtn.addEventListener("click", () => {
        bookElement.classList.remove("closed");
        const songNotebook = document.getElementById('song-notebook');
        songNotebook.style.paddingBottom = '400px';
    });

    closeBtn.addEventListener("click", () => {
        bookElement.classList.add("closed");
        const songNotebook = document.getElementById('song-notebook');
        songNotebook.style.paddingBottom = '';
    });
}

function renderWordResults(results) {
    perfRhymesDiv.innerHTML = '';
    nearRhymesDiv.innerHTML = '';
    synonymsDiv.innerHTML = '';

    console.log('InnerHTML:', synonymsDiv.innerHTML)

    results.perfRhymes.forEach(word => {
        const p = document.createElement('p');
        p.textContent = word;
        perfRhymesDiv.appendChild(p);
    })
    results.nearRhymes.forEach(word => {
        const p = document.createElement('p');
        p.textContent = word;
        nearRhymesDiv.appendChild(p);
    })
    results.synonyms.forEach(word => {
        const p = document.createElement('p');
        p.textContent = word;
        synonymsDiv.appendChild(p);
    })
}

function attachEventHandlers(editor, titleInput) {
    editor.addEventListener('input', () => {
        editorState.lyrics = [...editor.children].map(p => p.textContent);
        scheduleSave();

        handleWordLookup();
    })

    editor.addEventListener('keyup', () => {
        handleWordLookup();
    })

    editor.addEventListener('click', () => {
        handleWordLookup();
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

const dSaveSong = debounce(saveSong, 1000);

export function scheduleSave() {
    statusElement.textContent = "Saving...";
    dSaveSong(currentSongId);
}

// === Helpers ===

function getWordAtCursor() {
    const sel = window.getSelection();

    if (!sel.rangeCount || !sel.focusNode) return '';

    const textContent = sel.focusNode.textContent;

    let cursor = sel.getRangeAt(0).startOffset;
    let start;
    let end;

    // Snap cursor left to the nearest word character
    while (cursor >= 0 && !isWordChar(textContent.charAt(cursor))) cursor--;

    // Move left from cursor to find the start index of the word
    start = cursor;
    while (start >= 0 && isWordChar(textContent.charAt(start - 1))) start--;

    // Move right from cursor to find the start index of the word
    end = cursor;
    while (end >= 0 && isWordChar(textContent.charAt(end + 1))) end++;

    return textContent.slice(start, end + 1);
}

function isWordChar(char) {
    return (
        (char >= 'a' && char <= 'z') ||
        (char >= 'A' && char <= 'Z') ||
        (char >= '0' && char <= '9') ||
        char === '_' ||
        char === '\''
    )
}

const handleWordLookup = debounce(async () => {
    const word = getWordAtCursor();
    const results = await lookupWord(word);
    renderWordResults(results);
}, 300);

