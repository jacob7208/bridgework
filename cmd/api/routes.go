package main

import (
	"github.com/julienschmidt/httprouter"
	"net/http"
)

func (app *application) routes() http.Handler {
	router := httprouter.New()

	router.NotFound = http.HandlerFunc(app.spaHandler)
	router.MethodNotAllowed = http.HandlerFunc(app.methodNotAllowed)

	router.HandlerFunc(http.MethodGet, "/v1/healthcheck", app.healthcheckHandler)
	router.HandlerFunc(http.MethodPost, "/v1/songs", app.createSongHandler)
	router.HandlerFunc(http.MethodGet, "/v1/songs", app.listSongsHandler)
	router.HandlerFunc(http.MethodGet, "/v1/songs/:id", app.showSongHandler)
	router.HandlerFunc(http.MethodPatch, "/v1/songs/:id", app.updateSongHandler)
	router.HandlerFunc(http.MethodDelete, "/v1/songs/:id", app.deleteSongHandler)
	// router.HandlerFunc(http.MethodGet, "/v1/rhymes", app.getRhymesHandler)
	// router.HandlerFunc(http.MethodGet, "/v1/synonyms", app.getSynonymsHandler)
	// router.HandlerFunc(http.MethodPost, "/v1/brainstorm", app.brainstormHandler)

	fs := http.FileServer(http.Dir("./ui/static"))
	router.Handler(http.MethodGet, "/static/*filepath", http.StripPrefix("/static/", fs))

	router.HandlerFunc(http.MethodGet, "/", app.spaHandler)

	return app.recoverPanic(router)
}
