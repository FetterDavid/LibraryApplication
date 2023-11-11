import { Outlet, Route, Routes } from "react-router-dom";
import { AuthProtectedView } from "@/auth/components";
import { LoginPage } from "@/auth/pages";

function App() {
    return (
        <Routes>
            <Route path="/" element={
                <AuthProtectedView>
                    <Outlet />
                </AuthProtectedView>
            }></Route>
            <Route path="/login" element={ <LoginPage /> } />
        </Routes>
    );
}

export default App;
