import { useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import UnauthorizePageTemplate from "./components/layout/unauthorize-page-template/UnauthorizePageTemplate";
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

  const AuthorizeTemplate = <AuthorizeRoutes />;

  return (
    <BrowserRouter>
      {logged ? AuthorizeTemplate : UnauthorizeTemplate}
    </BrowserRouter>
  );
}

export default App;
