import { Route, Routes } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "../not-found/NotFound";

const AuthorizeRoutes = () => (
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    {/* Fall back routes */}
    <Route path="/" element={<Dashboard />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AuthorizeRoutes;
