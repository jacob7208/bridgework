import {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {deleteSong, fetchSong, updateSong} from "../services/api.ts";
import {FetchError} from "../types";
import {debounce, getCurrentWord, handleAPIError} from "../utils/helpers.ts";
import {lookupWord} from "../services/datamuse.ts";
import * as React from "react";
import Header from "../components/Header.tsx";

export default function SongEditPage() {
    const [title, setTitle] = useState("");
    const [lyrics, setLyrics] = useState<string[]>([]);
    const [rhymes, setRhymes] = useState<string[]>([]);
    const [synonyms, setSynonyms] = useState<string[]>([]);
    const [status, setStatus] = useState("");
    const [isBookOpen, setIsBookOpen] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(() => {
        const loadSong = async () => {
            try {
                // @ts-ignore
                const fetchedSong = await fetchSong(+id);
                setTitle(fetchedSong.title);
                setLyrics((fetchedSong.lyrics || "").split("\n"))
            } catch (error) {
                if (error instanceof FetchError) {
                    handleAPIError(error, navigate);
                    navigate("/app/songs");
                }
            }
        };

        loadSong();
    }, []);

    const saveSongRef = useRef<(() => Promise<void>) | null>(null);

    saveSongRef.current = async ()=> {
        if (!editorRef.current) return;

        const currentLyrics = [...editorRef.current.children].map(
            p => p.textContent || '\u200B'
        );

        try {
            console.log('Saving - id:', id, 'title:', title, 'lyrics length:', currentLyrics.length);
            //@ts-ignore
            await updateSong(+id, title, currentLyrics.join('\n'));
            setStatus("Saved");
        } catch (error) {
            if (error instanceof FetchError) {
                handleAPIError(error, navigate);
                setStatus("Error");
            }
        }
    };

    const debouncedSave = useRef(
        debounce(() => saveSongRef.current?.(), 3000)
    ).current;

    const handleSave = () => {
        setStatus("Saving...");
        debouncedSave();
    }

    const handleTitleInput = (e: any) => {
        setTitle(e.target.value || "Untitled");
        handleSave();
    }

    const handleLyricsInput = () => {
        handleSave();
        handleWordLookup();
    };

    const handleLyricsPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text.replace(/\r\n/g, '\n'));
    }

    const handleWordLookup = debounce(async () => {
        const word = getCurrentWord();
        if (word) {
            const results = await lookupWord(word);
            if (!results) return;

            setRhymes(results.rhymes);
            setSynonyms(results.synonyms)
        } else {
            setRhymes([]);
            setSynonyms([]);
        }
    }, 300);

    const handleBackBtnClick = () => {
        navigate("/app/songs");
    }

    const handleDeleteBtnClick = async () => {
        try {
            // @ts-ignore
            await deleteSong(+id);
        } catch (error) {
            if (error instanceof FetchError)
            handleAPIError(error, navigate);
        }
    }

    const handleBookOpen = () => {
        setIsBookOpen(true);
    }

    return (
        <>
            <Header isLoggedIn={true} />

            <main id="edit-view">
                <div className="view-header">
                    <button
                        id="back-btn"
                        className="btn hover-effect"
                        onClick={() => handleBackBtnClick()}
                    >Back</button>
                    <button
                        id="delete-btn"
                        className="btn hover-effect"
                        onClick={() => handleDeleteBtnClick()}
                    >Delete</button>
                    { status && <span id="save-status">{status}</span>}
                </div>
                <div id="song-notebook" className="notebook">
                    <div id="song-container" className="notebook-content">
                        <input
                            id="title-input"
                            className="title-input"
                            type="text"
                            maxLength={50}
                            placeholder="Untitled"
                            value={title}
                            onChange={(e) => handleTitleInput(e)}
                        />
                        <div
                            ref={editorRef}
                            id="lyric-editor"
                            className="lyric-editor"
                            contentEditable="true"
                            spellCheck="false"
                            onInput={handleLyricsInput}
                            onKeyUp={handleWordLookup}
                            onClick={handleWordLookup}
                            onPaste={handleLyricsPaste}
                        >
                            {lyrics.map((line, index) => (
                                <p key={`${index}-${line}`}>{line === '\u200B' ? '' : line}</p>
                                ))}
                        </div>
                    </div>
                </div>
                <div className="book-wrapper">
                    <div
                        className="book-open-btn"
                        onClick={() => handleBookOpen()}
                    >Rhymes & Synonyms</div>
                    <div id="book" className={isBookOpen ? "book" : "book closed"}>
                        <button className="book-close">close</button>
                        <p className="book-arrow">↓</p>
                        <div id="rhyme-dict" className="book-page-left">
                            <h3>Rhymes</h3>
                            <div id="rhymes">
                                {rhymes.map((rhyme, index) => (
                                    <p key={`${index}-${rhyme}`}>{rhyme}</p>
                                ))}
                            </div>
                        </div>
                        <div id="thesaurus" className="book-page-right">
                            <h3>Synonyms</h3>
                            <div id="synonyms">
                                {synonyms.map((synonym, index) => (
                                    <p key={`${index}-${synonym}`}>{synonym}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </>
    )
}