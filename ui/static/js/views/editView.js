import {fetchSong, updateSong} from "../api.js";
import {getTextWidth, handleTextWrap} from "../utils/textEditor.js";
import {currentSongId, LYRIC_INPUT_CLASS, NOTEBOOK_LINE_CLASS, setCurrentSongId, TITLE_INPUT_CLASS} from "../main.js";
import {createDiv, createInput} from "../utils/helpers.js";

const MAX_TITLE_LENGTH = 50;

let saveStatusElement;
let saveTimeout;
let inputs = [];

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

async function renderSong(songId) {
    const result = await fetchSong(songId);

    editorState.title = result.song.title;
    editorState.lyrics = (result.song.lyrics || '').split('\n');

    saveStatusElement = document.getElementById('save-status')
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
            saveStatusElement.textContent = "Title Max Length";
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

        const div = addLyricLine(inputs, lineText);

        container.appendChild(div);
    }
}

export function addLyricLine(inputs, lineText) {
    const div = createDiv(NOTEBOOK_LINE_CLASS);
    const input = createInput('text', lineText, LYRIC_INPUT_CLASS);

    attachWrapHandler(input, inputs)

    inputs.push(input);
    attachKeydownHandlers(input, inputs)

    div.appendChild(input);

    return div
}

function attachWrapHandler(input, inputs) {
    input.addEventListener('input', () => {
        editorState.lyrics = inputs.map(inp => inp.value);
        handleLyricsChange();

        const inputWidth = input.offsetWidth;
        const textWidth = getTextWidth(input.value, input);

        if (textWidth > inputWidth) {
            handleTextWrap(input);
        }
    });
}

function attachKeydownHandlers(input, inputs) {
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            enterKeydownHandler(event, input, inputs)
        }

        if (event.key === 'Backspace') {
            backspaceKeydownHandler(event, input, inputs)
        }

        if (event.key === 'ArrowDown') {
            downKeydownHandler(event, input, inputs)
        }

        if (event.key === 'ArrowUp') {
            upKeydownHandler(event, input, inputs)
        }
    })
}

function enterKeydownHandler(event, input, allInputs) {
    event.preventDefault();

    const cursorPos = input.selectionStart;
    const currentText = input.value;
    const textBefore = currentText.slice(0, cursorPos);
    const textAfter = currentText.slice(cursorPos);
    const currentIndex = allInputs.indexOf(input);
    const nextLine = allInputs[currentIndex + 1]

    if (currentIndex >= allInputs.length - 5 || nextLine === '') {
        const container = document.getElementById('song-container');
        const div = addLyricLine(allInputs, '');
        container.appendChild(div);
    }

    allInputs[currentIndex].value = textBefore;

    const linesBelow = allInputs.slice(currentIndex + 1).map(inp => inp.value);

    linesBelow.unshift(textAfter)

    allInputs.slice(currentIndex + 1).forEach((inp, i) => {
        inp.value = linesBelow[i] || '';
    });

    nextLine?.focus();
    nextLine.selectionStart = 0;
    nextLine.selectionEnd = 0;

    editorState.lyrics = allInputs.map(inp => inp.value);
}

function backspaceKeydownHandler(event, input, allInputs) {
    const cursorPos = input.selectionStart;
    const selectionEnd = input.selectionEnd;
    const hasSelection = cursorPos !== selectionEnd;
    const currentIndex = allInputs.indexOf(input);
    const currentInput = allInputs[currentIndex];

    if (currentInput.value === '') {
        currentInput.parentElement.remove()
        allInputs.splice(currentIndex, 1)
    }

    if (cursorPos === 0 && !hasSelection) {
        event.preventDefault();

        const linesBelow = allInputs.slice(currentIndex + 1).map(inp => inp.value);

        if (currentIndex === 0) return;

        const prevInput = allInputs[currentIndex - 1];
        const prevInputLength = prevInput.value.length
        const currentText = input.value;

        prevInput.value = prevInput.value + currentText

        allInputs.slice(currentIndex).forEach((inp, i) => {
            inp.value = linesBelow[i] || '';
        });

        if (prevInput) {
            prevInput.focus();
            prevInput.selectionStart = prevInputLength;
            prevInput.selectionEnd = prevInputLength;
        }

    }

    editorState.lyrics = allInputs.map(inp => inp.value);
}

function downKeydownHandler(event, input, inputs) {
    event.preventDefault();

    const currentIndex = inputs.indexOf(input);
    const nextIndex = currentIndex + 1;

    if (nextIndex >= inputs.length) return;

    const nextInput = inputs[nextIndex];
    nextInput.focus();
}

function upKeydownHandler(event, input, inputs) {
    event.preventDefault();

    const currentIndex = inputs.indexOf(input);
    const prevIndex = currentIndex - 1;

    if (currentIndex === 0) return;

    const nextInput = inputs[prevIndex];
    nextInput.focus();
}


async function saveSong(songId) {
    try {
       await updateSong(songId, editorState.title, editorState.lyrics.join('\n'));
       saveStatusElement.textContent = "Saved";
   } catch {
       saveStatusElement.textContent = "Error";
       console.log(error);
   }
}

function handleLyricsChange() {
    clearTimeout(saveTimeout);

    saveStatusElement.textContent = "Saving..."
    saveTimeout = setTimeout(() => {
        saveSong(currentSongId);
    }, 3000);
}