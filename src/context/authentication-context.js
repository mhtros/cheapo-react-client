import React, { useState } from "react";
import { apiUri } from "../appsettings";
import { errorToast } from "../helpers/toasts";

const authenticationContext = React.createContext({
  logged: !!localStorage.getItem("accessToken"),
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  signin: (email, password) => {},
  signout: () => {},
});

export const AuthenticationContextProvider = (props) => {
  const [isLogged, setIsLogged] = useState(false);
  const [accessTkn, setAccessTkn] = useState("");
  const [refreshTkn, setRefreshTkn] = useState("");

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

      response = await response.json();

      if (!response.ok) throw response;

      const access = response.data.accessToken;
      const refresh = response.data.refreshToken;

      localStorage.setItem("accessToken", access);
      setAccessTkn(access);

      localStorage.setItem("refreshToken", refresh);
      setRefreshTkn(refresh);

      setIsLogged(true);
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
      }}
    >
      {props.children}
    </authenticationContext.Provider>
  );
};

export default authenticationContext;