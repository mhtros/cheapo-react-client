import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authenticationContext from "../context/authentication-context";
import { errorToast } from "../helpers/toasts";

/**
 * In chase the refresh token is expired this custom hook signs out the user
 * and clears the authentication context.
 */
const useExpiredSession = () => {
  const authenticationCtx = useContext(authenticationContext);
  const navigate = useNavigate();

  const getQueryParams = () => {
    return new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
  };

  useEffect(() => {
    let value = getQueryParams().err;
    if (!value && value !== "expired-session") return;
    errorToast("Your session has expired. Please sign in!");
    authenticationCtx.signout();
    navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useExpiredSession;
