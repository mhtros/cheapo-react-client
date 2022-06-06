import { useContext } from "react";
import { apiUri } from "../appsettings";
import authenticationContext from "../context/authentication-context";
import displayError from "../helpers/exception-error";
import { errorMessages } from "../maps/error-messages";

const noContent = 204;

export const useHttp = () => {
  const authenticationCtx = useContext(authenticationContext);

  const httpCall = async (url, settings, authorized = true) => {
    try {
      if (!settings) settings = {};
      initializeHttpHeaders(settings, authorized);
      initializeHttpMethod(settings);

      const response = await fetch(url, settings);

      if (response.status === noContent) return;
      const pagination = getPagination(response);

      const data = await response?.json();

      if (data?.errors?.some((i) => typeof i === "string")) {
        if (data?.errors?.includes(errorMessages.expiredToken)) {
          const tokens = await refreshTokens();
          // update authorization header
          settings.headers.Authorization = `Bearer ${tokens.accessToken}`;
          return await resendRequest(url, settings);
        }
      }

      if (data?.errors || !response.ok) throw data;
      if (!!pagination) data.pagination = pagination;

      return data;
    } catch (error) {
      displayError(error);
      return Promise.reject(error);
    }
  };

  const getPagination = (response) => {
    const headers = [...response.headers];
    const paginationJson = headers?.find((x) => x[0] === "pagination");

    let pagination = null;

    if (!!paginationJson && paginationJson.length >= 2)
      pagination = JSON.parse(paginationJson[1]);

    return pagination;
  };

  const resendRequest = async (url, settings) => {
    const response = await fetch(url, settings);
    const pagination = getPagination(response);
    const data = await response.json();
    if (data?.errors || !response.ok) throw data;
    if (!!pagination) data.pagination = pagination;
    return data;
  };

  const refreshTokens = async () => {
    const refreshToken = authenticationCtx.refreshToken;
    const accessToken = authenticationCtx.accessToken;

    const url = `${apiUri}/authentication/refresh-token`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken, accessToken }),
    });

    const data = await response.json();

    const errors = [
      errorMessages.expiredRefreshToken,
      errorMessages.invalidToken,
    ];

    const invalidOrExpired = data?.errors?.some((x) => errors.includes(x));

    if (invalidOrExpired) {
      authenticationCtx.signout();
      throw Error("Your token has expired. Please signin");
    }

    if (data?.errors || !response.ok) throw data;

    // Update access and refresh tokens.
    authenticationCtx.InitializeStorageAndStates(data.data);

    return data.data;
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

  return { httpCall, refreshTokens };
};
