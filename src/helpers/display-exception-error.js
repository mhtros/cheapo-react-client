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
  if (!!error.errors) {
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

  errorToast("Something went wrong!");
};

const mappErrorMessage = (code) => {
  const map = {
    USER_ALREADY_EXISTS: "Username already exists",
    ACCOUNT_NOT_VERIFIED: "Account not verified",
  };
  if (!!map[code]) return map[code];
  else return code;
};

export default displayError;
