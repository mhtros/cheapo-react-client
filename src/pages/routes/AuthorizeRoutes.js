import { Route, Routes } from "react-router-dom";
import Dashboard from "../Dashboard";
import NotFound from "../NotFound";
import Password from "../settings/Password";
import PersonalData from "../settings/PersonalData";
import Profile from "../settings/Profile";
import TwoFactorAuthentication from "../settings/TwoFactorAuthentication";

const AuthorizeRoutes = () => (
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/settings/profile" element={<Profile />} />
    <Route path="/settings/password" element={<Password />} />
    <Route
      path="/settings/two-factor-authentication"
      element={<TwoFactorAuthentication />}
    />
    <Route path="/settings/personal-data" element={<PersonalData />} />
    {/* Fall back routes */}
    <Route path="/" element={<Dashboard />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AuthorizeRoutes;
