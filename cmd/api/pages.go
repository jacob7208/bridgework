package main

import (
	"net/http"
	"strings"
)

func (app *application) spaHandler(w http.ResponseWriter, r *http.Request) {
	if strings.HasPrefix(r.URL.Path, "/v1") {
		app.notFoundResponse(w, r)
		return
	}

	http.ServeFile(w, r, "./ui/index.html")
}
