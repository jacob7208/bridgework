package main

import (
	"net/http"
)

func (app *application) serveReactApp(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./dist/index.html")
}
