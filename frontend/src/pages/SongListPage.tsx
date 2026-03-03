import {FetchError, type Song} from "../types"
import {createSong, fetchSongs} from "../services/api.ts";
import {handleAPIError} from "../utils/helpers.ts";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import Header from "../components/Header.tsx";

export default function SongListPage() {
    const [songs, setSongs] = useState<Song[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadSongs = async () => {
            try {
                const fetchedSongs = await fetchSongs();
                if (!fetchedSongs) return;
                setSongs(fetchedSongs);
            } catch (error) {
                if (error instanceof FetchError) {
                    handleAPIError(error, navigate);
                    navigate("/");
                }
            }
        };

        loadSongs();
    }, [navigate]);

    const handleSongClick = (id: number) => {
        navigate(`/app/songs/${id}`);
    }

    const handleNewClick = async () => {
        const title = "Untitled";
        const lyrics = "";

        try {
            const song = await createSong(title, lyrics);
            const newSongId = song.id;
            navigate(`/app/songs/${newSongId}`);
        } catch (error) {
            if (error instanceof FetchError) {
                handleAPIError(error, navigate)
                navigate("/app/songs")
            }
        }

    }

    return (
        <>
            <Header isLoggedIn={true} />

            <main id="list-view">
                <div className="view-header">
                    <button
                        id="new-btn"
                        className="btn hover-effect"
                        onClick={() => handleNewClick()}
                    >New</button>
                </div>
                <div id="songs-notebook" className="notebook">
                    <div id="songs-container" className="notebook-content">
                        <div id="list-title" className="title-input">My Songs</div>
                        {songs.map((song) => (
                            <div key={song.id} className="notebook-line">
                                <span
                                    className="hover-effect"
                                    data-id={song.id}
                                    onClick={() => handleSongClick(song.id)}
                                >{song.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    )
}