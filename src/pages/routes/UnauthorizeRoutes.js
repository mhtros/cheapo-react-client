import { Route, Routes } from "react-router-dom";
import Signin from "../authentication/signin/Signin";
import Signup from "../authentication/signup/Signup";
import VerifyAccount from "../authentication/verify-account/VerifyAccount";

const UnauthorizeRoutes = () => (
  <Routes>
    <Route path="/sign-in" element={<Signin />} />
    <Route path="/sign-up" element={<Signup />} />
    <Route path="/verify-account" element={<VerifyAccount />} />
    {/* Fall back routes */}
    <Route path="*" element={<Signin />} />
  </Routes>
);

export default UnauthorizeRoutes;
