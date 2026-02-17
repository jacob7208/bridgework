import {newFetchError} from "./utils/helpers.js";

// === API Integration ===

const API_BASE_URL = 'https://api.datamuse.com';

export async function fetchPerfectRhymes(word) {
    const response = await fetch(`${API_BASE_URL}/words?rel_rhy=${word}&max=10`);
    const result = await response.json()

    if (!response.ok) throw newFetchError(response, result);
    return result;
}

export async function fetchNearRhymes(word) {
    const response = await fetch(`${API_BASE_URL}/words?rel_nry=${word}&max=10`);
    const result = await response.json()

    if (!response.ok) throw newFetchError(response, result);
    return result;
}

export async function fetchSynonyms(word) {
    const response = await fetch(`${API_BASE_URL}/words?rel_syn=${word}&max=10`);
    const result = await response.json()

    if (!response.ok) throw newFetchError(response, result);
    return result;
}

// === Helper Functions ===

export async function lookupWord(word) {
    const perfRhymeResult = await fetchPerfectRhymes(word);
    const nearRhymeResult = await fetchNearRhymes(word);
    const synonymsResult = await fetchSynonyms(word);

    if (!perfRhymeResult || !nearRhymeResult || !synonymsResult) return;

    let perfRhymes = [];
    let nearRhymes = [];
    let synonyms = [];

    for (let word of perfRhymeResult) {
        if (perfRhymes.length >= 7) break;
        if (word.numSyllables > 4) continue;
        if (word.score < 1000) continue;

        perfRhymes.push(word.word);
    }
    for (let word of nearRhymeResult) {
        if (nearRhymes.length >= 7) break;
        if (word.numSyllables > 4) continue;
        if (word.score < 1000) continue;

        nearRhymes.push(word.word);
    }
    for (let word of synonymsResult) {
        if (synonyms.length >= 14) break;
        if (word.score < 1000) continue;

        synonyms.push(word.word);
    }

    return {perfRhymes, nearRhymes, synonyms}
}