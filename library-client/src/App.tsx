import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProtectedView } from "@/auth/components";
import { LoginPage } from "@/auth/pages";
import { MainLayout } from "@/utils/components";
import { BookListPage } from "@/books/pages";
import { CategorisationPage } from "@/categorisation/pages";

function App() {
    return (
        <Routes>
            <Route path="/" element={
                <AuthProtectedView>
                    <MainLayout />
                </AuthProtectedView>
            }>
                <Route index element={ <Navigate to="/books" replace /> } />
                <Route path="books">
                    <Route index element={ <BookListPage /> } />
                </Route>
                <Route path="categorisation">
                    <Route index element={ <CategorisationPage /> } />
                </Route>
            </Route>
            <Route path="/login" element={ <LoginPage /> } />
        </Routes>
    );
}

export default App;
