import { Route, Routes } from "react-router-dom";
import useExpiredSession from "../../hooks/expired-session-hook";
import Compare from "../Compare";
import Dashboard from "../Dashboard";
import NotFound from "../NotFound";
import Password from "../settings/Password";
import PersonalData from "../settings/PersonalData";
import Profile from "../settings/Profile";
import TransactionCategories from "../settings/TransactionCategories";
import TwoFactorAuthentication from "../settings/TwoFactorAuthentication";
import Statistics from "../Statistics";

const AuthorizeRoutes = () => {
  useExpiredSession();
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/compare" element={<Compare />} />
      <Route path="/statistics" element={<Statistics />} />
      <Route path="/settings/profile" element={<Profile />} />
      <Route path="/settings/password" element={<Password />} />
      <Route
        path="/settings/transaction-categories"
        element={<TransactionCategories />}
      />
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
};

export default AuthorizeRoutes;
