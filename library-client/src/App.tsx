import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProtectedView } from "@/auth/components";
import { LoginPage } from "@/auth/pages";
import { MainLayout } from "@/utils/components";
import { BookDetailsPage, BookListPage } from "@/books/pages";
import { CategorisationPage } from "@/categorisation/pages";
import { MemberListPage, MemberProfilePage } from "@/members/pages";
import { AcquisitionsPage } from "@/acquisitions/pages";
import { BorrowingPage } from "@/borrowing/pages";

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
                    <Route path=":id" element={ <BookDetailsPage /> } />
                </Route>
                <Route path="members">
                    <Route index element={ <MemberListPage /> } />
                    <Route path=":id" element={ <MemberProfilePage /> } />
                </Route>
                <Route path="borrowing">
                    <Route index element={ <BorrowingPage /> } />
                </Route>
                <Route path="acquisitions">
                    <Route index element={ <AcquisitionsPage /> } />
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
