package data

import (
	"database/sql"
	"errors"
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

type SongModel struct {
	DB *sql.DB
}

func (m SongModel) Insert(song *Song) error {
	query := `
        INSERT INTO songs (title, lyrics)
        VALUES ($1, $2)
        RETURNING id, created_at, version`

	args := []any{song.Title, song.Lyrics}

	return m.DB.QueryRow(query, args...).Scan(&song.ID, &song.CreatedAt, &song.Version)
}

func (m SongModel) Get(id int64) (*Song, error) {
	if id < 1 {
		return nil, ErrRecordNotFound
	}

	query := `
        SELECT id, created_at, title, lyrics, version
 		FROM songs
 		WHERE id = $1`

	var song Song

	err := m.DB.QueryRow(query, id).Scan(
		&song.ID,
		&song.CreatedAt,
		&song.Title,
		&song.Lyrics,
		&song.Version,
	)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &song, nil
}

func (m SongModel) Update(song *Song) error {
	query := `
		UPDATE songs
		SET title = $1, lyrics = $2, version = version + 1
		WHERE id = $3
		RETURNING version`

	args := []any{
		song.Title,
		song.Lyrics,
		song.ID,
	}

	return m.DB.QueryRow(query, args...).Scan(&song.Version)
}

func (m SongModel) Delete(id int64) error {
	if id < 1 {
		return ErrRecordNotFound
	}

	query := `
		DELETE from songs
		    WHERE id = $1`

	result, err := m.DB.Exec(query, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return ErrRecordNotFound
	}

	return nil
}
