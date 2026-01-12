package main

import (
	"fmt"
	"github.com/jacob7208/bridgework/internal/data"
	"net/http"
	"time"
)

func (app *application) createSongHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "create a new movie")
}

func (app *application) showSongHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	song := data.Song{
		ID:        id,
		CreatedAt: time.Now(),
		Title:     "Drowning",
		Lyrics:    "Your arms look so lonely without me\nJust give me a hand when I'm drowning",
		Version:   1,
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"song": song}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
