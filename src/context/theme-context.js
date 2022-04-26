import React, { useState } from "react";

const themeContext = React.createContext({
  dark: false,
  toggle: () => {},
});

export const ThemeContextProvider = (props) => {
  const [isDark, setIsDark] = useState(
    JSON.parse(localStorage.getItem("dark")) || false
  );

  const toggleHandler = async () => {
    localStorage.setItem("dark", !isDark);
    setIsDark((prev) => !prev);
  };

  return (
    <themeContext.Provider
      value={{
        dark: isDark,
        toggle: toggleHandler,
      }}
    >
      {props.children}
    </themeContext.Provider>
  );
};

export default themeContext;
