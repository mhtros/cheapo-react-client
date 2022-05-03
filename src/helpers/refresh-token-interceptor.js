import axios from "axios";
import jwt_decode from "jwt-decode";
import { apiUri } from "../appsettings";
import { customHistory } from "../components/CustomBrowserRouter";

export const addRefreshTokenInterceptor = () => {
  httpRequestInterceptor();
  httpResponseInterceptor();
};

const httpRequestInterceptor = () => {
  axios.interceptors.request.use(
    (request) => {
      const accessToken = localStorage.getItem("accessToken");
      const isApiUrl = request.url.startsWith(apiUri);
      if (!isApiUrl) return request;
      request.headers.common["Content-Type"] = "application/json";
      request.headers.common.Authorization = `Bearer ${accessToken}`;
      return request;
    },
    (err) => {
      return Promise.reject(err);
    }
  );
};

const httpResponseInterceptor = () => {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const isApiUrl = error.request.responseURL.startsWith(apiUri);
      if (!isApiUrl) return Promise.reject();

      const expired = error.response.data.errors.includes("EXPIRED_TOKEN");

      if (!expired) return Promise.reject();

      // If expired === true means that the access token has expired.

      const refreshToken = localStorage.getItem("refreshToken");
      const accessToken = localStorage.getItem("accessToken");
      const url = `${apiUri}/authentication/refresh-token`;

      // Try to refresh the access token using the refresh token.

      try {
        var response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken, accessToken }),
        });

        response = await response.json();

        const errors = ["EXPIRED_REFRESH_TOKEN", "INVALID_TOKEN"];
        const InvalidOrExpired = response?.errors?.some((x) =>
          errors.includes(x)
        );

        if (InvalidOrExpired) {
          // Clear localStorage and redirect with expired-session query param
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          customHistory.replace("/?err=expired-session"); // reload.
          return Promise.reject();
        }

        // Update access and refresh tokens.
        const decodedToken = jwt_decode(response.data.accessToken);
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(decodedToken));

        // Try again the failed (due to access token expiration) request.
        error.config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return axios.request(error.config);
      } catch (ex) {
        return Promise.reject(ex);
      }
    }
  );
};
