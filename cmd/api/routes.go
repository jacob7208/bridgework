package main

import (
	"github.com/julienschmidt/httprouter"
	"net/http"
)

func (app *application) routes() http.Handler {
	router := httprouter.New()

	router.NotFound = http.HandlerFunc(app.notFoundResponse)
	router.MethodNotAllowed = http.HandlerFunc(app.methodNotAllowed)

	router.HandlerFunc(http.MethodGet, "/v1/healthcheck", app.healthcheckHandler)

	router.HandlerFunc(http.MethodPost, "/v1/songs", app.requireActivatedUser(app.createSongHandler))
	router.HandlerFunc(http.MethodGet, "/v1/songs", app.requireActivatedUser(app.listSongsHandler))
	router.HandlerFunc(http.MethodGet, "/v1/songs/:id", app.requireActivatedUser(app.showSongHandler))
	router.HandlerFunc(http.MethodPatch, "/v1/songs/:id", app.requireActivatedUser(app.updateSongHandler))
	router.HandlerFunc(http.MethodDelete, "/v1/songs/:id", app.requireActivatedUser(app.deleteSongHandler))
	// router.HandlerFunc(http.MethodGet, "/v1/rhymes", app.getRhymesHandler)
	// router.HandlerFunc(http.MethodGet, "/v1/synonyms", app.getSynonymsHandler)
	// router.HandlerFunc(http.MethodPost, "/v1/brainstorm", app.brainstormHandler)

	router.HandlerFunc(http.MethodPost, "/v1/users", app.registerUserHandler)
	router.HandlerFunc(http.MethodPut, "/v1/users/activated", app.activateUserHandler)

	router.HandlerFunc(http.MethodPost, "/v1/tokens/authentication", app.createAuthenticationTokenHandler)

	fs := http.FileServer(http.Dir("./ui/static"))
	router.Handler(http.MethodGet, "/static/*filepath", http.StripPrefix("/static/", fs))

	router.HandlerFunc(http.MethodGet, "/", app.serveLoginPage)
	router.HandlerFunc(http.MethodGet, "/signup", app.serveSignUpPage)
	router.HandlerFunc(http.MethodGet, "/login", app.serveLoginPage)
	router.HandlerFunc(http.MethodGet, "/activate", app.serveActivatePage)

	router.HandlerFunc(http.MethodGet, "/app", app.serveSPA)
	router.HandlerFunc(http.MethodGet, "/app/*filepath", app.serveSPA)

	return app.recoverPanic(app.authenticate(router))
}
