# BridgeWork

A lightweight songwriting assistant that provides real-time rhyme and synonym suggestions as you write. 
No more toggling between tabs to find the right word.

![BridgeWork Interface](docs/images/screenshot.png)

## Demo
Visit [bridgework.prismcoretech.com](https://bridgework.prismcoretech.com) for a live demo.

> **Credentials:** demo@bridgework.mailer.me / password123

## Running Locally

### Prerequisites:
- Go 1.25+ 
- PostgreSQL with a `bridgework` database and user created
### Environment Variables (or runtime flags)
| Variable | Description |
|----------|-------------|
| `DB_DSN` | Postgres connection string |
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP server port |
| `SMTP_USERNAME` | SMTP username |
| `SMTP_PASSWORD` | SMTP password |

```sh
go mod download
go run ./cmd/api
```


## Tech Stack
- Go (Backend)
- HTML/CSS/JavaScript (Frontend)
- Postgres (Database)

## Current Features
- Signup/activation/login/logout lifecycle
- Text editor with autosave
- Dynamic rhyme and synonym recommendations

## Planned Features
- Smarter rhyme and synonym suggestions
- AI brainstorm that offers thematic directions
- Caching rhymes and synonyms on backend
- Real-time collaboration
- Multiple themes/customizations
- Upload song audio to loop while writing
- Record melody ideas for lines
- Pre-made labels such as Verse, Chorus, etc
- Add chords above lyric lines


