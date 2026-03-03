import {type FetchError} from "../types";

export function debounce(func: Function, delay: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return function(...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func(...args);
        }, delay);
    }
}

export function handleAPIError(error: FetchError, navigate: (path: string) => void) {
    if (error.status === 401) {
        localStorage.removeItem('authToken');
        navigate("/login");
        return;
    }

    return error;
}

export function getCurrentWord() {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount || !sel.focusNode) return '';

    if (!sel.rangeCount || !sel.focusNode) return '';

    const textContent = sel.focusNode.textContent;
    if (!textContent) return '';

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

export function isWordChar(char: string) {
    return (
        (char >= 'a' && char <= 'z') ||
        (char >= 'A' && char <= 'Z') ||
        (char >= '0' && char <= '9') ||
        char === '_' ||
        char === '\''
    )
}
