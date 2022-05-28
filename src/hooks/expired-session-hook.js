import { useEffect } from "react";
import displayError from "../helpers/exception-error";
import { useHttp } from "./http-hook";

/**
 * In chase the refresh token is expired this custom hook signs out the user
 * and clears the authentication context.
 */
const useExpiredSession = () => {
  const { refreshTokens } = useHttp();

  useEffect(() => {
    const checkSession = async () => {
      try {
        await refreshTokens();
      } catch (e) {
        displayError(e);
      }
    };
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useExpiredSession;
