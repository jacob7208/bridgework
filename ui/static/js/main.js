let saveTimeout;
let currentSongId;
let saveStatusElement;

function navigate(path) {
    window.history.pushState({}, '', path);
    router();
}

function router() {
    const path = window.location.pathname;

    if (path === '/' || path === '/songs') {
        showListView();
    } else if (path.startsWith('/songs/')) {
        const songId = path.split('/')[2];
        showEditView(songId)
    }
}

window.addEventListener('popstate', router);

window.addEventListener('DOMContentLoaded', router);

async function showListView() {
    const container = document.getElementById('songs-container');

    if (container.children.length === 0) {
        await getSongs();
    }

    document.getElementById('list-view').style.display = 'block'
    document.getElementById('edit-view').style.display = 'none'
}

function showEditView(songId) {
    getSong(songId)
    document.getElementById('list-view').style.display = 'none'
    document.getElementById('edit-view').style.display = 'block'

    saveStatusElement = document.getElementById('save-status')
}

function handleSongClick(event) {
    const songId = event.target.getAttribute('data-id')
    navigate(`/songs/${songId}`);
}

async function getSongs() {
    const url = "http://localhost:4000/v1/songs";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();

        const container = document.getElementById('songs-container');

        for (let song of result.songs) {
            const div = document.createElement('div');
            div.className = 'notebook-line';

            const span = document.createElement('span');
            span.className = 'hover-effect';
            span.setAttribute("data-id", song.id)
            span.textContent = song.title;
            span.addEventListener("click", handleSongClick);

            div.appendChild(span);
            container.appendChild(div);
        }
    } catch (error) {
        console.error(error.message)
    }
}

async function saveSong(songId) {
    const inputs = document.querySelectorAll('.lyric-input');
    const title = document.querySelector('.title-input').value
    
    const lyrics = Array.from(inputs)
        .map(input => input.value)
        .join('\n');

    const url = `http://localhost:4000/v1/songs/${songId}`;
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, lyrics })
    })

    if (response.ok) {
        saveStatusElement.textContent = "Saved"
    } else {
        saveStatusElement.textContent = "Error"
    }
}

function handleLyricsChange() {
    clearTimeout(saveTimeout);

    saveStatusElement.textContent = "Saving..."
    saveTimeout = setTimeout(() => {
        saveSong(currentSongId);
    }, 3000);
}

async function getSong(songId) {
    currentSongId = songId;
    const url = `http://localhost:4000/v1/songs/${songId}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();

        const header = document.getElementById('edit-header');
        const existingTitle = header.querySelector('.notebook-line');
        if (existingTitle) {
            existingTitle.remove();
        }

        const titleDiv = document.createElement('div');
        titleDiv.className = 'notebook-line';

        const titleInput = document.createElement('input') ;
        titleInput.value = result.song.title;
        titleInput.className = 'title-input'
        titleInput.addEventListener('input', (event) => {
            handleLyricsChange()

            const inputWidth = titleInput.offsetWidth;
            const textWidth = getTextWidth(titleInput.value, titleInput);

            if (textWidth > inputWidth) {
                saveStatusElement.textContent = "Max Char Limit"
            }
        })

        titleDiv.appendChild(titleInput)
        header.insertBefore(titleDiv, saveStatusElement);

        const container = document.getElementById('song-container');
        container.innerHTML = '';

        const lines = result.song.lyrics.split('\n');
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight);
        const minLines = (vh - 160) / 32;
        const totalLines = Math.max(lines.length, minLines);

        for (let i = 0; i < totalLines; i++) {
            const lineText = lines[i] || '';
            const div = document.createElement('div');
            div.className = 'notebook-line';

            const input = document.createElement('input');
            input.type = 'text';
            input.value = lineText;
            input.className = 'lyric-input';

            input.addEventListener('input', (event) => {
                handleLyricsChange();

                const inputWidth = input.offsetWidth;
                const textWidth = getTextWidth(input.value, input);

                if (textWidth > inputWidth) {
                    handleTextWrap(input);
                }
            });
            input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();

                    const nextInput = event.target.parentElement.nextElementSibling?.querySelector('input');
                    nextInput.focus();
                }

                if (event.key === 'ArrowDown') {
                    event.preventDefault();

                    const nextInput = event.target.parentElement.nextElementSibling?.querySelector('input');
                    nextInput.focus();
                }

                if (event.key === 'ArrowUp') {
                    event.preventDefault();

                    const nextInput = event.target.parentElement.previousElementSibling?.querySelector('input');
                    nextInput.focus();
                }

                if (event.key === 'Backspace') {
                    const cursorPos = input.selectionStart;
                    const selectionEnd = input.selectionEnd;
                    const hasSelection = cursorPos !== selectionEnd;

                    if (cursorPos === 0 && !hasSelection) {
                        event.preventDefault();

                        const prevInput = input.parentElement.previousElementSibling?.querySelector('input');

                        if (prevInput) {
                            prevInput.focus();
                            prevInput.selectionStart = prevInput.value.length;
                            prevInput.selectionEnd = prevInput.value.length;
                        }
                    }
                }
            })

            div.appendChild(input);
            container.appendChild(div);
        }
    } catch (error) {
        console.error(error.message)
    }
}

function getTextWidth(text, element) {
    const span = document.createElement('span');
    span.style.font = window.getComputedStyle(element).font;
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.textContent = text;
    document.body.appendChild(span);
    const width = span.offsetWidth;
    document.body.removeChild(span);
    return width;
}

function handleTextWrap(input) {
    const text = input.value;
    const words = text.split(' ');
    const inputWidth = input.offsetWidth;

    let fittingText = '';
    let overflowText = '';

    for (let i = 0; i < words.length; i++) {
        const testText = words.slice(0, i + 1).join(' ');

        if (getTextWidth(testText, input) <= inputWidth) {
            fittingText = testText;
        } else {
            overflowText = words.slice(i).join(' ');
            break;
        }
    }

    input.value = fittingText;

    const allInputs = Array.from(document.querySelectorAll('.lyric-input'));
    const currentIndex = allInputs.indexOf(input);
    const linesBelow = allInputs.slice(currentIndex + 1).map(inp => inp.value)

    linesBelow.unshift(overflowText);

    allInputs.slice(currentIndex + 1).forEach((inp, i) => {
        inp.value = linesBelow[i] || '';
    });

    allInputs[currentIndex + 1]?.focus();
}