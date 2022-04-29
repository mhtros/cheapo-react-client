import { useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import AuthorizePageTemplate from "./components/layout/AuthorizePageTemplate";
import UnauthorizePageTemplate from "./components/layout/UnauthorizePageTemplate";
import authenticationContext from "./context/authentication-context";
import AuthorizeRoutes from "./pages/routes/AuthorizeRoutes";
import UnauthorizeRoutes from "./pages/routes/UnauthorizeRoutes";

function App() {
  const logged = useContext(authenticationContext).logged;

  const UnauthorizeTemplate = (
    <UnauthorizePageTemplate>
      <UnauthorizeRoutes />
    </UnauthorizePageTemplate>
  );

  const AuthorizeTemplate = (
    <AuthorizePageTemplate>
      <AuthorizeRoutes />
    </AuthorizePageTemplate>
  );

  return (
    <BrowserRouter>
      {logged ? AuthorizeTemplate : UnauthorizeTemplate}
    </BrowserRouter>
  );
}

export default App;
