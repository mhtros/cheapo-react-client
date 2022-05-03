import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import CombinedProvider from "./context/CombinedProvider";
import { addRefreshTokenInterceptor } from "./helpers/refresh-token-interceptor";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));

addRefreshTokenInterceptor();

root.render(
  <React.StrictMode>
    <CombinedProvider>
      <ToastContainer />
      <App />
    </CombinedProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
