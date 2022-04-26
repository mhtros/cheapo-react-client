import { errorToast } from "./toasts";

/**
 *
 * @param {*} error - The exception error
 * @returns
 */
const displayError = (error) => {
  if (typeof error === "string") {
    errorToast(error);
    return;
  }
  if (!!error.errors) {
    for (const propertyName in error.errors) {
      errorToast(error.errors[propertyName].join("\n"));
    }
    return;
  }
  if (!!error.title) {
    errorToast(error.title);
    return;
  }

  errorToast("Something went wrong!");
};

export default displayError;
