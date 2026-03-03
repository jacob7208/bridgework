package main

import (
	"net/http"
	"strings"
)

func (app *application) serveReactApp(w http.ResponseWriter, r *http.Request) {
	if strings.HasPrefix(r.URL.Path, "/v1") {
		app.notFoundResponse(w, r)
		return
	}

	http.ServeFile(w, r, "./dist/index.html")
}
