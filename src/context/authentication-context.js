import jwt_decode from "jwt-decode";
import React, { useState } from "react";
import { apiUri } from "../appsettings";
import displayError from "../helpers/display-exception-error";
import { messages } from "../helpers/messages";

const authenticationContext = React.createContext({
  user: {},
  logged: false,
  accessToken: "",
  refreshToken: "",
  twoFactorSignin: async (email, token, isRecoveryToken) => {},
  signin: async (email, password) => {},
  signout: () => {},
  setImage: (image) => {},
  setTwoFactor: (value) => {},
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

      if (response?.data === messages.twoFactorAuthenticationEnabled)
        return false;

      InitializeStorageAndStates(response.data);

      return true;
    } catch (ex) {
      displayError(ex);
    }
  };

  const twoFactorSigninHandler = async (email, token, isRecoveryToken) => {
    const url = `${apiUri}/authentication/two-factor-signin`;

    try {
      var response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token, isRecoveryToken }),
      });

      if (!response.ok) throw await response.json();
      response = await response.json();

      InitializeStorageAndStates(response.data);
    } catch (ex) {
      displayError(ex);
    }
  };

  const signoutHandler = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setAccessTkn("");
    setRefreshTkn("");
    setIsLogged(false);
    setUsr({});
    window.location.replace("/");
  };

  const setImageHandler = (image) => {
    setUsr({ ...usr, image: image });
    localStorage.setItem("user", JSON.stringify(usr));
  };

  const setTwoFactorHandler = (value) => {
    setUsr({ ...usr, twoFactorEnabled: value });
    localStorage.setItem("user", JSON.stringify(usr));
  };

  const InitializeStorageAndStates = (data) => {
    setIsLogged(true);

    const access = data.accessToken;
    const refresh = data.refreshToken;
    const decodedToken = jwt_decode(access);

    decodedToken.twoFactorEnabled = JSON.parse(decodedToken.twoFactorEnabled);

    localStorage.setItem("accessToken", access);
    setAccessTkn(access);

    localStorage.setItem("refreshToken", refresh);
    setRefreshTkn(refresh);

    localStorage.setItem("user", JSON.stringify(decodedToken));
    setUsr(decodedToken);
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
        setImage: setImageHandler,
        setTwoFactor: setTwoFactorHandler,
        twoFactorSignin: twoFactorSigninHandler,
      }}
    >
      {props.children}
    </authenticationContext.Provider>
  );
};

export default authenticationContext;
