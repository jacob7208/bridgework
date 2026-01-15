package main

import (
	"fmt"
	"github.com/jacob7208/bridgework/internal/data"
	"github.com/jacob7208/bridgework/internal/validator"
	"net/http"
	"time"
)

func (app *application) createSongHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Title  string `json:"title"`
		Lyrics string `json:"lyrics"`
	}

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	song := &data.Song{
		Title:  input.Title,
		Lyrics: input.Lyrics,
	}

	v := validator.New()

	if data.ValidateSong(v, song); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	fmt.Fprintf(w, "%+v\n", input)
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
