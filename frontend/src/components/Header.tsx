import {useNavigate} from 'react-router'
import {logoutUser} from "../services/api.ts";
import {FetchError} from "../types";
import {handleAPIError} from "../utils/helpers.ts";

export default function Header({isLoggedIn}: {isLoggedIn: boolean}) {
    const navigate = useNavigate();

    const handleSignup = () => {
        navigate("/signup");
    }

    const handleLogin = () => {
        navigate("/login");
    }

    const handleLogout = async () => {
        console.log('Logout clicked');
        localStorage.removeItem("authToken");
        try {
            await logoutUser();
            navigate("/login");
        } catch (error) {
            if (error instanceof FetchError)
                handleAPIError(error, navigate);
        }
    }

    return (
        <header>
            <div className="header-inner">
                <div className="header-left">
                    <h1>BridgeWork</h1>
                </div>
                <div className="header-right">
                    {!isLoggedIn && (<button
                        id="signup-btn"
                        className="btn"
                        onClick={() => handleSignup()}
                    >Sign Up</button>)}
                    {!isLoggedIn && (<button
                        id="login-btn"
                        className="btn"
                        onClick={() => handleLogin()}
                    >Log In</button>)}
                    {isLoggedIn && (<button
                        id="logout-btn"
                        className="btn"
                        onClick={() => handleLogout()}
                    >Log Out</button>)}
                </div>
            </div>
        </header>
    )
}