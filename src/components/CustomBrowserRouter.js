import { createBrowserHistory } from "history";
import { useLayoutEffect, useRef, useState } from "react";
import { Router } from "react-router-dom";

// Can be used to manage navigation state outside of React components
export const customHistory = createBrowserHistory();

export function CustomBrowserRouter({ basename, children }) {
  const historyRef = useRef();
  if (historyRef.current == null) {
    historyRef.current = customHistory;
  }
  const history = historyRef.current;
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      basename={basename}
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
}
