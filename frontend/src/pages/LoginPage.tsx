import {fetchAuthenticationToken} from "../services/api";
import {useState} from "react";
import {useNavigate} from "react-router-dom"
import {FetchError} from "../types";
import Header from "../components/Header.tsx";


export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailErr, setEmailErr] = useState("");
    const [passwordErr, setPasswordErr] = useState("");
    const [formMsg, setFormMsg] = useState("");
    const navigate = useNavigate();

    if (localStorage.getItem('authToken'))  navigate('/app/songs');

    // @ts-ignore
    const handleSubmit =  async (e) => {
        e.preventDefault();

        setEmailErr('');
        setPasswordErr('');
        setFormMsg('');

        try {
            const result = await fetchAuthenticationToken(email, password);
            localStorage.setItem('authToken', result.token);
            navigate('/app/songs');

        } catch (error) {
            if (error instanceof FetchError) {
                if (error.status === 422) {
                    setEmailErr(error.data.email || "");
                    setPasswordErr(error.data.password || "");
                } else {
                    setFormMsg(error.data || "");
                }
            }

        }
    };

    return (
        <>
            <Header isLoggedIn={false} />

            <div className="auth-container">
                <h2>Welcome back</h2>
                <div className="login-form">
                    <form id="login-form" onSubmit={handleSubmit} noValidate>
                        {formMsg && <div id="form-msg" className="form-message">{formMsg}</div>}
                        <div className="form-group">
                            {emailErr && <div id="email-err" className="error-message">{emailErr}</div>}
                            <input
                                id="email"
                                className="form-input"
                                type="email"
                                value={email}
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            {passwordErr && <div id="password-err" className="error-message">{passwordErr}</div>}
                            <input
                                id="password"
                                className="form-input"
                                type="password"
                                value={password}
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" id="submitBtn" className="submit-btn">Log in</button>
                    </form>
                    <p className="toggle-auth">
                        Don't have an account? <a href="/signup">Sign up</a>
                    </p>
                </div>
            </div>
        </>
    )
}