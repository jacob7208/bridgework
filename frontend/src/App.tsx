import { Routes, Route } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import ActivatePage from "./pages/ActivatePage.tsx";
import SongListPage from "./pages/SongListPage.tsx";
import SongEditPage from "./pages/SongEditPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";

function App() {
    return (
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/activate" element={<ActivatePage />} />


                <Route
                    path="/app/songs"
                    element={
                        <ProtectedRoute>
                            <SongListPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/app/songs/:id"
                    element={
                        <ProtectedRoute>
                            <SongEditPage />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
    );
}

export default App
