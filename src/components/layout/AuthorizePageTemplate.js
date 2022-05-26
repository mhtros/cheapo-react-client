import Footer from "./Footer";
import Header from "./Header";

const AuthorizePageTemplate = ({ children }) => {
  return (
    <div
      id="authorize-template"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Header />
      <div style={{ flexGrow: 1 }}>{children}</div>
      <Footer />
    </div>
  );
};

export default AuthorizePageTemplate;
