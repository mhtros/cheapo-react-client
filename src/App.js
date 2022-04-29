import { useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import UnauthorizePageTemplate from "./components/layout/unauthorize-page-template/UnauthorizePageTemplate";
import authenticationContext from "./context/authentication-context";
import themeContext from "./context/theme-context";
import AuthorizeRoutes from "./pages/routes/AuthorizeRoutes";
import UnauthorizeRoutes from "./pages/routes/UnauthorizeRoutes";

function App() {
  const logged = useContext(authenticationContext).logged;
  const isDark = useContext(themeContext).dark;

  const lightTheme = () => {
    document.body.classList.add("body");
    document.body.classList.remove("body--dark");
  };

  const darkTheme = () => {
    document.body.classList.add("body--dark");
    document.body.classList.remove("body");
  };

  isDark ? darkTheme() : lightTheme();

  const routes = logged ? (
    <AuthorizeRoutes />
  ) : (
    <UnauthorizePageTemplate>
      <UnauthorizeRoutes />
    </UnauthorizePageTemplate>
  );
  return <BrowserRouter>{routes}</BrowserRouter>;
}

export default App;
