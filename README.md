# BridgeWork

AI-powered songwriting assistant that helps lyricists find better rhymes, explore synonyms, and brainstorm thematic directions.

## MVP Goals
Build a functional web app where users can:
1. Input lyrics in progress
2. Select a word and get rhyme suggestions (sorted by syllable match, filtered for cliches)
3. Get synonym suggestions for selected words
4. Get high-level thematic/directional suggestions from LLM (NOT exact lyrics)
5. Save and load their lyrics

## TODO

### Day 1-2
- [ ] Initialize Go project
- [ ] Set up basic web server with html/template
- [ ] Create simple UI: textarea for lyrics, buttons for rhyme/synonym/brainstorm, results display
- [ ] Test: Can load page and submit text

### Day 3-4
- [ ] Integrate Datamuse API - rhyme & synonym endpoint
- [ ] Build ranking algorithm: sort by syllable count match, filter common words
- [ ] Test: Can get and display ranked rhymes/synonyms

### Day 5
- [ ] Set up Ollama locally
- [ ] Create LLM prompt for thematic suggestions
- [ ] Integrate LLM endpoint into Go backend
- [ ] Test: Can get thematic suggestions based on lyrics

### Day 6
- [ ] Set up postgres database (songs table: id, title, lyrics, created_at)
- [ ] Add save functionality
- [ ] Add load/list functionality
- [ ] Test: Can save and retrieve lyrics

### Day 7
- [ ] Set up GitHub Actions for CI/CD (build on push, deploy to production)
- [ ] Deploy to Railway or Render
- [ ] Switch LLM from Ollama to Claude/OpenAI API
- [ ] Write proper README with screenshots, setup instructions
- [ ] Test production deployment

