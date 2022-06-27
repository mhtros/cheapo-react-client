import ReactDOM from "react-dom/client";

import App from "./App";
import CombinedProvider from "./context/CombinedProvider";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <CombinedProvider>
    <App />
  </CombinedProvider>
);
