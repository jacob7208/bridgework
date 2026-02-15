export function createDiv(id, className) {
    const div = document.createElement('div');
    div.id = id
    div.className = className;

    return div;
}

export function createInput(id, className, type) {
    const input = document.createElement('input');
    input.id = id
    input.className = className;
    input.type = type;

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

export function newFetchError(response, result) {
    const err = new Error('Request Failed');
    err.status = response.status;
    err.data = result.error;
    return err
}

export function handleAPIError(error) {
    if (error.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        return;
    }

    return error;
}
