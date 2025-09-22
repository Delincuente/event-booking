import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import { useAuthStore } from "./store/useAuthStore";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function App() {
  const authUser = useAuthStore((state) => state.authUser);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Routes>
      {/* Public routes */}

      {/* Protected routes */}
      <Route path="/" element={authUser ? <Home /> :
        <Navigate to="/login" />
      }></Route>

      <Route path="/login" element={!authUser ? <Login /> :
        <Navigate to="/" />
      }></Route>
      <Route path="/registration" element={!authUser ? <Registration /> : <Registration />}></Route>

      {/* Catch-all for 404 */}
      <Route path="*" element={<NotFound />}></Route>
    </Routes>
  );
}

export default App;