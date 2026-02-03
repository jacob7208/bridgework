import {fetchSong, updateSong} from "../api.js";
import {currentSongId, LYRIC_INPUT_CLASS, NOTEBOOK_LINE_CLASS, setCurrentSongId, TITLE_INPUT_CLASS} from "../main.js";
import {createDiv, createInput, debounce} from "../utils/helpers.js";
import {getTextWidth, handleTextWrap} from "../utils/textEditor.js";

const MAX_TITLE_LENGTH = 50;
const MAX_HISTORY_SIZE = 50;
const TYPING_PAUSE_THRESHOLD = 500;

const editorState = {
    title: '',
    lyrics: [],
    focusedLineIndex: 0,
    cursorPos: 0
}

const pastEditorStates = [];
const futureEditorStates = [];

let inputs = [];
let statusElement;
let lastKeystrokeTime = 0;

const dSaveSong = debounce(saveSong, 3000);

export async function showEditView(songId) {
    document.getElementById('list-view').style.display = 'none';
    document.getElementById('edit-view').style.display = 'block';

    await renderSong(songId)
    setCurrentSongId(songId)
}

// === Render Functions ===

async function renderSong(songId) {
    const result = await fetchSong(songId);

    editorState.title = result.song.title;
    editorState.lyrics = (result.song.lyrics || '').split('\n');

    statusElement = document.getElementById('save-status')
    const container = document.getElementById('song-container');
    container.innerHTML = '';

    renderTitle(container);
    renderLyrics(container);
}

function renderTitle(container) {
    const titleDiv = createDiv(NOTEBOOK_LINE_CLASS);
    const titleInput = createInput('text', editorState.title, TITLE_INPUT_CLASS);
    titleInput.maxLength = MAX_TITLE_LENGTH;

    titleInput.addEventListener('input', () => {
        editorState.title = titleInput.value;
        handleLyricsChange();

        if (titleInput.value.length >= MAX_TITLE_LENGTH) {
            titleInput.value = titleInput.value.slice(0, MAX_TITLE_LENGTH);
            statusElement.textContent = "Title Max Length";
        }
    })

    titleDiv.appendChild(titleInput)
    container.appendChild(titleDiv)
}

function renderLyrics(container) {
    const lines = editorState.lyrics
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight);
    const minLines = (vh - 160) / 32;
    const totalLines = Math.max(lines.length, minLines);

    for (let i = 0; i < totalLines; i++) {
        const lineText = lines[i] || '';

        const div = addLyricLine(lineText);

        container.appendChild(div);
    }
}

function rerender() {
    const container = document.getElementById('song-container');
    container.innerHTML = '';
    inputs = [];

    renderTitle(container);
    renderLyrics(container);

    const focusedLine = inputs[editorState.focusedLineIndex];
    focusedLine?.focus();
    focusedLine.selectionStart = editorState.cursorPos;
    focusedLine.selectionEnd = editorState.cursorPos;

}

function addLyricLine(lineText) {
    const div = createDiv(NOTEBOOK_LINE_CLASS);
    const input = createInput('text', lineText, LYRIC_INPUT_CLASS);

    attachInputHandler(input)

    inputs.push(input);
    attachKeydownHandlers(input)

    div.appendChild(input);

    return div
}

// === State Management ===

function updateEditorState(input) {
    editorState.lyrics = inputs.map(inp => inp.value);
    editorState.focusedLineIndex = inputs.indexOf(input);
    editorState.cursorPos = input.selectionStart;
}

function saveToHistory() {
    futureEditorStates.length = 0;
    if (pastEditorStates.length >= MAX_HISTORY_SIZE) {
        pastEditorStates.pop()
    }
    const state = structuredClone(editorState);
    pastEditorStates.unshift(state);
}

function handleTypingSession(input) {
    const now = Date.now();
    const sinceLastKeystroke = now - lastKeystrokeTime;
    if (sinceLastKeystroke > TYPING_PAUSE_THRESHOLD) {
        updateEditorState(input)
        saveToHistory(input);
    }
    lastKeystrokeTime = now;
}

// === Event Handlers ===

function attachInputHandler(input) {
    input.addEventListener('input', () => {
        handleTypingSession(input);
        updateEditorState(input);
        handleLyricsChange();

        const inputWidth = input.offsetWidth;
        const textWidth = getTextWidth(input.value, input);

        if (textWidth > inputWidth) {
            handleTextWrap(input);
        }
    });
}

function attachKeydownHandlers(input) {
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            enterKeydownHandler(input)
        }

        if (event.key === 'Backspace') {
            backspaceKeydownHandler(event, input)
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            downKeydownHandler(input)
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            upKeydownHandler(input)
        }

        const isCtrlPressed = event.ctrlKey || event.metaKey;

        if (isCtrlPressed && event.key.toLowerCase() === 'z') {
            event.preventDefault();
            if (event.shiftKey) {
                redoHandler();
            } else {
                undoHandler();
            }
        }

        if (isCtrlPressed && event.key.toLowerCase() === 'v') {
            pasteHandler();
        }
    })
}

function enterKeydownHandler(input) {
    const cursorPos = input.selectionStart;
    const currentText = input.value;
    const textBefore = currentText.slice(0, cursorPos);
    const textAfter = currentText.slice(cursorPos);
    const currentIndex = inputs.indexOf(input);
    const nextLine = inputs[currentIndex + 1]

    saveToHistory(input);

    if (currentIndex >= inputs.length - 5 || nextLine === '') {
        const container = document.getElementById('song-container');
        const div = addLyricLine(inputs, '');
        container.appendChild(div);
    }

    inputs[currentIndex].value = textBefore;

    const linesBelow = inputs.slice(currentIndex + 1).map(inp => inp.value);

    linesBelow.unshift(textAfter)

    inputs.slice(currentIndex + 1).forEach((inp, i) => {
        inp.value = linesBelow[i] || '';
    });

    nextLine?.focus();
    nextLine.selectionStart = 0;
    nextLine.selectionEnd = 0;

    updateEditorState(input);
    statusElement.textContent = "Saving...";
    dSaveSong(currentSongId)
}

function backspaceKeydownHandler(event, input) {
    const cursorPos = input.selectionStart;
    const selectionEnd = input.selectionEnd;
    const hasSelection = cursorPos !== selectionEnd;
    const currentIndex = inputs.indexOf(input);
    const currentInput = inputs[currentIndex];
    const prevInput = inputs[currentIndex - 1];
    const prevInputLength = prevInput.value.length

    handleTypingSession(input);

    if (currentIndex === 0) return;

    if (currentInput.value === '') {
        event.preventDefault();
        currentInput.parentElement.remove()
        inputs.splice(currentIndex, 1);
        prevInput.focus();
        prevInput.selectionStart = prevInputLength;
        prevInput.selectionEnd = prevInputLength;
        return;
    }

    if (cursorPos === 0 && !hasSelection) {
        event.preventDefault();

        const linesBelow = inputs.slice(currentIndex + 1).map(inp => inp.value);

        const currentText = input.value;

        prevInput.value = prevInput.value + currentText

        inputs.slice(currentIndex).forEach((inp, i) => {
            inp.value = linesBelow[i] || '';
        });

        if (prevInput) {
            prevInput.focus();
            prevInput.selectionStart = prevInputLength;
            prevInput.selectionEnd = prevInputLength;
        }

    }
    updateEditorState(input);
    statusElement.textContent = "Saving...";
    dSaveSong(currentSongId)
}

function downKeydownHandler(input) {
    const currentIndex = inputs.indexOf(input);
    const nextIndex = currentIndex + 1;

    if (nextIndex >= inputs.length) return;

    const nextInput = inputs[nextIndex];
    nextInput.focus();
}

function upKeydownHandler(input) {
    const currentIndex = inputs.indexOf(input);
    const prevIndex = currentIndex - 1;

    if (currentIndex === 0) return;

    const nextInput = inputs[prevIndex];
    nextInput.focus();
}

function undoHandler() {
    const state = structuredClone(editorState);
    futureEditorStates.unshift(state);

    if (pastEditorStates.length === 0) return;

    const newState = pastEditorStates.shift();
    editorState.title = newState.title;
    editorState.lyrics = newState.lyrics;
    editorState.focusedLineIndex = newState.focusedLineIndex;
    editorState.cursorPos = newState.cursorPos;

    rerender();
}

function redoHandler() {
    const state = structuredClone(editorState);
    pastEditorStates.unshift(state);

    if (futureEditorStates.length === 0) return;

    const newState = futureEditorStates.shift();
    editorState.title = newState.title;
    editorState.lyrics = newState.lyrics;
    editorState.focusedLineIndex = newState.focusedLineIndex;
    editorState.cursorPos = newState.cursorPos;

    rerender();
}

function pasteHandler() {
    dSaveSong(currentSongId)
}

// === Backend Integration ===

async function saveSong(songId) {
    try {
       await updateSong(songId, editorState.title, editorState.lyrics.join('\n'));
       statusElement.textContent = "Saved";
   } catch (error) {
       statusElement.textContent = "Error";
       console.log(error);
   }
}

export function handleLyricsChange() {
    statusElement.textContent = "Saving...";
    dSaveSong(currentSongId);
}