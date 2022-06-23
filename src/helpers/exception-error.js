import { errorToast } from "./toasts";

/**
 * Displays a proper message given the exception value.
 * @param {*} error - The exception value
 */
const displayError = (error) => {
  if (typeof error === "string") {
    errorToast(error);
    return;
  }

  if (error.errors) {
    for (const propertyName in error.errors) {
      const property = error.errors[propertyName];
      if (typeof property === "object" && Array.isArray(property)) {
        errorToast(error.errors[propertyName].join("\n"));
      } else if (typeof property === "string") {
        errorToast(mappErrorMessage(property));
      } else errorToast("Something went wrong!");
    }
    return;
  }

  if (!!error.title) {
    errorToast(error.title);
    return;
  }

  if (error?.message) {
    errorToast(error.message);
    return;
  }

  errorToast("Something went wrong!");
};

const mappErrorMessage = (code) => {
  const map = {
    USER_ALREADY_EXISTS: "Username already exists",
    ACCOUNT_NOT_VERIFIED: "Account not verified",
    EXPIRED_TOKEN: "Expired token",
    EXPIRED_REFRESH_TOKEN: "The Refresh token is expired",
    EMAIL_NOT_SEND: "Email was not sent",
    INVALID_TOKEN: "Invalid token",
    NOT_VALID_TWO_FACTOR_TOKEN: "Two factor token is not valid",
    INVALID_QUERY_PARAMETERS: "Invalid query parameters",
    ALREADY_EXISTS: "Already exists",
    ENTITY_NOT_SAVED: "Entity not saved",
    ENTITY_NOT_REMOVED: "Entity not removed",
    ENTITY_NOT_UPDATED: "Entity not updated",
    INCORECT_USERNAME_OR_PASSWORD: "Incorrect username or password",
  };
  if (!!map[code]) return map[code];
  else return code;
};

export default displayError;
