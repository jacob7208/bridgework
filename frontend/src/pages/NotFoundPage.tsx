import Header from "../components/Header.tsx";

export default function NotFoundPage() {
    return (
        <>
            <main>
                <Header isLoggedIn={false} />
                <h1>404 Not Found</h1>
            </main>
        </>
    )
}