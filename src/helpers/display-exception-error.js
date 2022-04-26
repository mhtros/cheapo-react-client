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
