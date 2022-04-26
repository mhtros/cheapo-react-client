import { AuthenticationContextProvider } from "./authentication-context";
import { ThemeContextProvider } from "./theme-context";

const CombinedProvider = (props) => {
  return (
    <AuthenticationContextProvider>
      <ThemeContextProvider>{props.children}</ThemeContextProvider>
    </AuthenticationContextProvider>
  );
};

export default CombinedProvider;
