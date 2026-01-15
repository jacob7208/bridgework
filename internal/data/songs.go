package data

import (
	"github.com/jacob7208/bridgework/internal/validator"
	"time"
)

type Song struct {
	ID        int64     `json:"id"`
	CreatedAt time.Time `json:"-"`
	Title     string    `json:"title,omitzero"`
	Lyrics    string    `json:"lyrics,omitzero"`
	Version   int32     `json:"version,omitzero"`
}

func ValidateSong(v *validator.Validator, song *Song) {
	v.Check(song.Title != "", "title", "must be provided")
	v.Check(len(song.Title) <= 500, "title", "must not be more than 500 bytes long")
}
