import { Route, Routes } from "react-router-dom";
import ForgotPassword from "../authentication/ForgotPassword";
import ResetPassword from "../authentication/ResetPassword";
import Signin from "../authentication/Signin";
import Signup from "../authentication/Signup";
import VerifyAccount from "../authentication/VerifyAccount";

const UnauthorizeRoutes = () => (
  <Routes>
    <Route path="/sign-in" element={<Signin />} />
    <Route path="/sign-up" element={<Signup />} />
    <Route path="/verify-account" element={<VerifyAccount />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    {/* Fall back routes */}
    <Route path="*" element={<Signin />} />
  </Routes>
);

export default UnauthorizeRoutes;
