package data

import (
	"context"
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
	UserID    int64     `json:"user_id"`
}

func ValidateSong(v *validator.Validator, song *Song) {
	v.Check(song.Title != "", "title", "must be provided")
	v.Check(len(song.Title) <= 500, "title", "must not be more than 500 bytes long")
}

type SongModel struct {
	DB *sql.DB
}

func (m SongModel) Insert(song *Song, userID int64) error {
	query := `
        INSERT INTO songs (title, lyrics, user_id)
        VALUES ($1, $2, $3)
        RETURNING id, created_at, version`

	args := []any{song.Title, song.Lyrics, userID}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	return m.DB.QueryRowContext(ctx, query, args...).Scan(&song.ID, &song.CreatedAt, &song.Version)
}

func (m SongModel) Get(songID, userID int64) (*Song, error) {
	if songID < 1 {
		return nil, ErrRecordNotFound
	}

	query := `
        SELECT id, created_at, title, lyrics, version
 		FROM songs
 		WHERE id = $1 AND user_id = $2`

	var song Song

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, query, songID, userID).Scan(
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

func (m SongModel) Update(song *Song, userID int64) error {
	query := `
		UPDATE songs
		SET title = $1, lyrics = $2, version = version + 1
		WHERE id = $3 AND version = $4 AND user_id = $5
		RETURNING version`

	args := []any{
		song.Title,
		song.Lyrics,
		song.ID,
		song.Version,
		userID,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, query, args...).Scan(&song.Version)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return ErrEditConflict
		default:
			return err
		}
	}

	return nil
}

func (m SongModel) Delete(songID, userID int64) error {
	if songID < 1 {
		return ErrRecordNotFound
	}

	query := `
		DELETE from songs
		    WHERE id = $1 AND user_id = $2`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	result, err := m.DB.ExecContext(ctx, query, songID, userID)
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

func (m SongModel) GetAll(userID int64) ([]*Song, error) {
	query := `
		SELECT id, created_at, title, lyrics, version
		FROM songs
		WHERE user_id = $1
		ORDER BY id`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var songs []*Song

	for rows.Next() {
		var song Song

		err := rows.Scan(
			&song.ID,
			&song.CreatedAt,
			&song.Title,
			&song.Lyrics,
			&song.Version,
		)
		if err != nil {
			return nil, err
		}

		songs = append(songs, &song)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return songs, nil
}
