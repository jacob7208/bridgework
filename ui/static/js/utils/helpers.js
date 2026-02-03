export function createDiv(className, textContent) {
    const div = document.createElement('div');
    div.className = className;
    div.textContent = textContent;

    return div;
}

export function createInput(type, value, className) {
    const input = document.createElement('input');
    input.type = type;
    input.value = value;
    input.className = className;

    return input;
}

export function createSpan(className, textContent) {
    const span = document.createElement('span');
    span.className = className;
    span.textContent = textContent;

    return span;
}

export function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    }
}