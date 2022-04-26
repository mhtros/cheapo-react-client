import jwt_decode from "jwt-decode";
import React, { useState } from "react";
import { apiUri } from "../appsettings";
import { errorToast } from "../helpers/toasts";

const authenticationContext = React.createContext({
  user: {},
  logged: false,
  accessToken: "",
  refreshToken: "",
  signin: (email, password) => {},
  signout: () => {},
});

export const AuthenticationContextProvider = (props) => {
  const [isLogged, setIsLogged] = useState(
    !!localStorage.getItem("accessToken")
  );

  const [accessTkn, setAccessTkn] = useState(
    localStorage.getItem("accessToken") || ""
  );

  const [refreshTkn, setRefreshTkn] = useState(
    localStorage.getItem("refreshToken") || ""
  );

  const [usr, setUsr] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );

  const signinHandler = async (email, password) => {
    const url = `${apiUri}/authentication/signin`;

    try {
      var response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw await response.json();

      response = await response.json();

      setIsLogged(true);

      const access = response.data.accessToken;
      const refresh = response.data.refreshToken;
      const decodedToken = jwt_decode(access);

      localStorage.setItem("accessToken", access);
      setAccessTkn(access);

      localStorage.setItem("refreshToken", refresh);
      setRefreshTkn(refresh);

      localStorage.setItem("user", JSON.stringify(decodedToken));
      setUsr(decodedToken);
    } catch (ex) {
      if (!ex.errors) {
        errorToast("Something went wrong!");
        return;
      }
      for (const item in ex.errors) {
        errorToast(ex.errors[item].join("\n"));
      }
    }
  };

  const signoutHandler = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAccessTkn("");
    setRefreshTkn("");
    setIsLogged(false);
  };

  return (
    <authenticationContext.Provider
      value={{
        logged: isLogged,
        accessToken: accessTkn,
        refreshToken: refreshTkn,
        signin: signinHandler,
        signout: signoutHandler,
        user: usr,
      }}
    >
      {props.children}
    </authenticationContext.Provider>
  );
};

export default authenticationContext;
