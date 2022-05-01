import Footer from "./Footer";
import Header from "./Header";

const AuthorizePageTemplate = ({ children }) => {
  return (
    <div style={{ maxWidth: "30rem", minWidth: "20rem", margin: "0 auto" }}>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default AuthorizePageTemplate;
