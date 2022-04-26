import { useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import authenticationContext from "./context/authentication-context";
import AuthorizeRoutes from "./pages/routes/AuthorizeRoutes";
import UnauthorizeRoutes from "./pages/routes/UnauthorizeRoutes";

function App() {
  const logged = useContext(authenticationContext).logged;
  const routes = logged ? <AuthorizeRoutes /> : <UnauthorizeRoutes />;
  return <BrowserRouter>{routes}</BrowserRouter>;
}

export default App;
