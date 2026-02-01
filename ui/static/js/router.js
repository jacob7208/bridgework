let listViewHandler;
let editViewHandler;

export function setViewHandlers(listView, editView) {
    listViewHandler = listView;
    editViewHandler = editView;
}

export function navigate(path) {
    window.history.pushState({}, '', path);
    router();
}

function router() {
    const path = window.location.pathname;

    if (path === '/' || path === '/songs') {
        listViewHandler();
    } else if (path.startsWith('/songs/')) {
        const songId = path.split('/')[2];
        editViewHandler(songId);
    }
}

window.addEventListener('popstate', router);

window.addEventListener('DOMContentLoaded', router);
