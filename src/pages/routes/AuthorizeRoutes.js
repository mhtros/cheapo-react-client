import { Route, Routes } from "react-router-dom";
import Dashboard from "../Dashboard";
import NotFound from "../NotFound";

const AuthorizeRoutes = () => (
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    {/* Fall back routes */}
    <Route path="/" element={<Dashboard />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AuthorizeRoutes;
