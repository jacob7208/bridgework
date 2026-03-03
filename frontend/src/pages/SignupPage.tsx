import {useState} from "react";
import {registerUser} from "../services/api.ts";
import {FetchError} from "../types";
import Header from "../components/Header.tsx";


export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nameErr, setNameErr] = useState("");
    const [emailErr, setEmailErr] = useState("");
    const [passwordErr, setPasswordErr] = useState("");
    const [formMsg, setFormMsg] = useState("");

    // @ts-ignore
    const handleSubmit = async (e) => {
        e.preventDefault();

        setNameErr("");
        setEmailErr("");
        setPasswordErr("");
        setFormMsg("");

        try {
            await registerUser(name, email, password);

            setFormMsg("Please check your email to activate your account");
            setName("");
            setEmail("");
            setPassword("");
        } catch (error) {
            if (error instanceof FetchError) {
                if (error.status === 422) {
                    setNameErr(error.data.name || "");
                    setEmailErr(error.data.email || "");
                    setPasswordErr(error.data.password || "");
                } else {
                    setFormMsg(error.data || "");
                }
            }
        }
    }

    return (
        <>
            <Header isLoggedIn={false} />

            <main>
                <div className="auth-container">
                    <h2>Create your account</h2>
                    <div className="signup-form">
                        <form id="signup-form" onSubmit={handleSubmit} noValidate>
                            {formMsg && <div id="form-msg" className="form-message">{formMsg}</div>}
                            <div className="form-group">
                                {nameErr && <div id="name-err" className="error-message">{nameErr}</div>}
                                <input
                                    id="name"
                                    className="form-input"
                                    type="text"
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Name"
                                />
                            </div>
                            <div className="form-group">
                                {emailErr && <div id="email-err" className="error-message">{emailErr}</div>}
                                <input
                                    id="email"
                                    className="form-input"
                                    type="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                />
                            </div>
                            <div className="form-group">
                                {passwordErr && <div id="password-err" className="error-message">{passwordErr}</div>}
                                <input
                                    id="password"
                                    className="form-input"
                                    type="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                />
                            </div>

                            <button id="submitBtn" type="submit" className="submit-btn">Sign up</button>
                        </form>
                    </div>
                    <p className="toggle-auth">
                        Already have an account? <a href="/login">Log in</a>
                    </p>
                </div>
            </main>
        </>
    )
}