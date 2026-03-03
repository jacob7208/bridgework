import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { fetchCurrentUser } from "../services/api"; 

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            setIsAuthenticated(false);
            setLoading(false);
            return;
        }

        // Verify token with backend
        fetchCurrentUser()
            .then(() => setIsAuthenticated(true))
            .catch(() => {
                localStorage.removeItem("authToken");
                setIsAuthenticated(false);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return <>{children}</>;
}