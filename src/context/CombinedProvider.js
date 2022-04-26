import { AuthenticationContextProvider } from "./authentication-context";

const CombinedProvider = (props) => {
  return (
    <AuthenticationContextProvider>
      {props.children}
    </AuthenticationContextProvider>
  );
};

export default CombinedProvider;
