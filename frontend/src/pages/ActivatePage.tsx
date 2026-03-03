import {activateUser} from "../services/api.ts";
import {handleAPIError} from "../utils/helpers.ts";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {FetchError} from "../types";
import Header from "../components/Header.tsx";


export default function ActivatePage() {

    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const handleClick = async () => {
        setMsg("");

        const token = new URLSearchParams(window.location.search).get("token");

        if (!token) {
            setMsg("No activation token. Check URL");
            return;
        }

        try {
            await activateUser(token);

            setMsg("Success! Redirecting to login...");

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            if (error instanceof FetchError) {
                handleAPIError(error, navigate);
                setMsg(error.data);
            }
        }
    };

    return (
        <>
            <Header isLoggedIn={false} />

            <main>
                <div className="auth-container">
                    <div id="activation-content">
                        <h2>Activate Your Account</h2>
                        <p>Click the button below to activate your account</p>
                        <button
                            id="activate-btn"
                            className="submit-btn"
                            onClick={() => handleClick()}
                        >Activate Account</button>
                        {msg && <div id="msg" className="form-message">{msg}</div>}
                    </div>
                </div>
            </main>
        </>
    )
}