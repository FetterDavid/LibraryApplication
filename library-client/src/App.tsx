import { Outlet, Route, Routes } from "react-router-dom";
import { AuthProtectedView } from "@/auth/components";
import { LoginPage } from "@/auth/pages";
import { MainLayout } from "@/utils/components";

function App() {
    return (
        <Routes>
            <Route path="/" element={
                <AuthProtectedView>
                    <Outlet />
                </AuthProtectedView>
            }>
                <Route index element={ <MainLayout /> }></Route>
            </Route>
            <Route path="/login" element={ <LoginPage /> } />
        </Routes>
    );
}

export default App;
