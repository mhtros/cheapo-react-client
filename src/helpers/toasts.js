import { toast } from "react-toastify";

export const successToast = (message) =>
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: JSON.parse(localStorage.getItem("dark")) || false ? "dark" : "light",
  });

export const errorToast = (message) =>
  toast.error(message, {
    autoClose: 10000,
    position: "top-right",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: JSON.parse(localStorage.getItem("dark")) || false ? "dark" : "light",
  });
