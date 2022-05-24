import Footer from "./Footer";
import Header from "./Header";

const AuthorizePageTemplate = ({ children }) => {
  return (
    <div
      id="authorize-template"
      style={{
        display: "flex",
        flexDirection: "column",
        background: "var(--base-color-200)",
      }}
    >
      <Header />
      <div style={{ flexGrow: 1 }}>{children}</div>
      <Footer />
    </div>
  );
};

export default AuthorizePageTemplate;
