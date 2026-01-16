CREATE TABLE IF NOT EXISTS songs (
    id bigserial PRIMARY KEY,
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    title text NOT NULL,
    lyrics text NOT NULL,
    version integer NOT NULL DEFAULT 1
);