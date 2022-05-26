import { useContext } from "react";
import { apiUri } from "../appsettings";
import authenticationContext from "../context/authentication-context";
import displayError from "../helpers/exception-error";
import { errorMessages } from "../maps/error-messages";

export const useHttp = () => {
  const authenticationCtx = useContext(authenticationContext);

  const httpCall = async (url, settings, authorized = true) => {
    try {
      if (!settings) settings = {};
      initializeHttpHeaders(settings, authorized);
      initializeHttpMethod(settings);

      const response = await fetch(url, settings);
      const data = await response.json();

      if (data?.errors?.includes(errorMessages.expiredToken)) {
        await refreshToken();
        return await resendRequest(url, settings);
      }

      if (data?.errors) {
        displayError(data.errors);
        throw data.errors;
      }

      return data;
      //
    } catch (error) {
      displayError(error);
      return Promise.reject(error);
    }
  };

  const resendRequest = async (url, settings) => {
    initializeHttpHeaders(settings);
    initializeHttpMethod(settings);

    const response = await fetch(url, settings);
    const data = await response.json();

    if (data?.errors) {
      displayError(data.errors);
      throw data.errors;
    }
    return data;
  };

  const refreshToken = async () => {
    const refreshToken = authenticationCtx.refreshToken;
    const accessToken = authenticationCtx.accessToken;

    const url = `${apiUri}/authentication/refresh-token`;

    var response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken, accessToken }),
    });

    if (!response.ok) throw await response.json();

    var data = await response.json();

    const errors = [
      errorMessages.expiredRefreshToken,
      errorMessages.invalidToken,
    ];

    const invalidOrExpired = data?.errors?.some((x) => errors.includes(x));

    if (invalidOrExpired) {
      authenticationCtx.signout();
      throw Error("Your token has expired. Please signin");
    }

    // Update access and refresh tokens.
    authenticationCtx.InitializeStorageAndStates(data.data);
  };

  const initializeHttpHeaders = (settings, authorized) => {
    if (!settings?.hasOwnProperty("headers")) settings.headers = {};

    if (!settings?.headers?.hasOwnProperty("Content-Type"))
      settings.headers = {
        ...settings.headers,
        "Content-Type": "application/json",
      };

    if (authorized)
      settings.headers = {
        ...settings.headers,
        Authorization: `Bearer ${authenticationCtx.accessToken}`,
      };
  };

  const initializeHttpMethod = (settings) => {
    if (!settings?.hasOwnProperty("method")) settings.method = "GET";
  };

  return { httpCall };
};
