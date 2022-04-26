import { Route, Routes } from "react-router-dom";
import Signin from "../authentication/signin/Signin";

const UnauthorizeRoutes = () => (
  <Routes>
    <Route path="/sign-in" element={<Signin />} />
    {/* Fall back routes */}
    <Route path="*" element={<Signin />} />
  </Routes>
);

export default UnauthorizeRoutes;
