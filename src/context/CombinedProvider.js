import { AuthenticationContextProvider } from "./authentication-context";
import { CurrencyContextProvider } from "./currency-context";
import { ThemeContextProvider } from "./theme-context";

const CombinedProvider = (props) => {
  return (
    <AuthenticationContextProvider>
      <ThemeContextProvider>
        <CurrencyContextProvider>{props.children}</CurrencyContextProvider>
      </ThemeContextProvider>
    </AuthenticationContextProvider>
  );
};

export default CombinedProvider;
