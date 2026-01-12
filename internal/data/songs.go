package data

import "time"

type Song struct {
	ID        int64     `json:"id"`
	CreatedAt time.Time `json:"-"`
	Title     string    `json:"title,omitzero"`
	Lyrics    string    `json:"lyrics,omitzero"`
	Version   int32     `json:"version,omitzero"`
}
