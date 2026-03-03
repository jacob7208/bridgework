import { type Word, FetchError } from "../types";


// === API Integration ===

const API_BASE_URL = 'https://api.datamuse.com';

export async function fetchPerfectRhymes(word: string): Promise<Word[]> {
    const response = await fetch(`${API_BASE_URL}/words?rel_rhy=${word}`);
    const result = await response.json()

    if (!response.ok) throw new FetchError(response, result);
    return result;
}

export async function fetchNearRhymes(word: string): Promise<Word[]> {
    const response = await fetch(`${API_BASE_URL}/words?rel_nry=${word}`);
    const result = await response.json()

    if (!response.ok) throw new FetchError(response, result);
    return result;
}

export async function fetchSynonyms(word: string): Promise<Word[]> {
    const response = await fetch(`${API_BASE_URL}/words?rel_syn=${word}`);
    const result = await response.json()

    if (!response.ok) throw new FetchError(response, result);
    return result;
}

// === Helper Functions ===

export async function lookupWord(word: string) {
    const perfRhymeResult = await fetchPerfectRhymes(word);
    const nearRhymeResult = await fetchNearRhymes(word);
    const synonymsResult = await fetchSynonyms(word);

    if (!perfRhymeResult || !nearRhymeResult || !synonymsResult) return;

    let rhymes = [];
    let synonyms = [];

    for (let word of perfRhymeResult) {
        if (word.numSyllables === undefined || word.numSyllables > 4) continue;
        if (word.score === undefined || word.score < 1000) continue;

        rhymes.push(word.word);
    }
    for (let word of nearRhymeResult) {
        if (word.numSyllables === undefined || word.numSyllables > 4) continue;
        if (word.score === undefined || word.score < 1000) continue;

        rhymes.push(word.word);
    }
    for (let word of synonymsResult) {
        if (word.score === undefined || word.score < 1000) continue;

        synonyms.push(word.word);
    }

    return {rhymes, synonyms}
}