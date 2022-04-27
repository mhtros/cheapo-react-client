import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import CenteredContainer from "../../../components/layout/centered-container/CenteredContainer";
import Button from "../../../components/UI/button/Button";
import Card from "../../../components/UI/card/Card";
import Input from "../../../components/UI/input/Input";
import authenticationContext from "../../../context/authentication-context";
import themeContext from "../../../context/theme-context";
import classes from "./Signin.module.css";

const Signin = () => {
  const authenticationCtx = useContext(authenticationContext);
  const themeCtx = useContext(themeContext);
  const darkClass = themeCtx.dark ? "--dark" : "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signinHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await authenticationCtx.signin(email, password);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <CenteredContainer>
      <Card>
        <form className={classes["signin-form"]}>
          <h1 className={classes[`signin-form_h1${darkClass}`]}>
            Sign in to your account
          </h1>
          <Input
            id="email"
            type="text"
            label="Email"
            placeholder="Enter you email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPassword
          />
          <Button
            style={{ marginTop: "1rem" }}
            type="submit"
            loadingText="Loading"
            text="Sign in"
            loading={loading}
            onClick={signinHandler}
          />
          <div className={classes["signin-form_links"]}>
            <Link className={classes["link"]} to="/forgot-password  ">
              Forgot your password?
            </Link>
            <div style={{ display: "flex" }}>
              <div style={{ flex: "1 1 0%" }}>
                <div className={classes[`signin-form__forgot${darkClass}`]}>
                  Don't have an account yet?{" "}
                  <Link className={classes["link"]} to="/sign-up">
                    Sign up!
                  </Link>
                </div>
              </div>
              <div>
                <Link className={classes["link"]} to="/verify-account">
                  Verify email!
                </Link>
              </div>
            </div>
          </div>
        </form>
      </Card>
    </CenteredContainer>
  );
};

export default Signin;
