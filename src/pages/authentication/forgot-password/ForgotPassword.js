import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUri } from "../../../appsettings";
import CenteredContainer from "../../../components/layout/centered-container/CenteredContainer";
import Button from "../../../components/UI/button/Button";
import Card from "../../../components/UI/card/Card";
import Input from "../../../components/UI/input/Input";
import themeContext from "../../../context/theme-context";
import displayError from "../../../helpers/display-exception-error";
import { successToast } from "../../../helpers/toasts";
import classes from "./ForgotPassword.module.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const themeCtx = useContext(themeContext);
  const darkClass = themeCtx.dark ? "--dark" : "";

  const [email, setEmail] = useState("");

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [retypedPassword, setRetypedPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);

  const forgotPasswordHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const url = `${apiUri}/authentication/forgot-password`;
      var response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw await response.json();

      successToast("You have been sent a reset code in the email " + email);
      setLoading(false);
      setShowResetForm(true);
    } catch (ex) {
      setLoading(false);
      displayError(ex);
    }
  };

  const resetPasswordHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const url = `${apiUri}/authentication/reset-password`;
      var response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          ConfirmPassword: retypedPassword,
          code,
        }),
      });

      if (!response.ok) throw await response.json();

      successToast("Password successfully changed!");
      navigate("/sign-in");
    } catch (ex) {
      setLoading(false);
      displayError(ex);
    }
  };

  const toggleForm = (event) => {
    event.preventDefault();
    setShowResetForm((prev) => !prev);
  };

  return (
    <CenteredContainer>
      <Card>
        {showResetForm === false && (
          <form className={classes["forgot-password-form"]}>
            <h1 className={classes[`forgot-password-form_h1${darkClass}`]}>
              Forgot your password
            </h1>
            <Input
              id="email"
              type="text"
              label="Email"
              placeholder="Enter an email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              style={{ marginTop: "1rem" }}
              type="submit"
              loadingText="Loading"
              text="Request reset code"
              loading={loading}
              onClick={forgotPasswordHandler}
            />
            <div className={classes["forgot-password-form_links"]}>
              <div
                className={classes[`forgot-password-form__forgot${darkClass}`]}
              >
                <div className={classes["forgot-password-reset-code"]}>
                  Already have a reset code?
                  <button onClick={toggleForm}> Reset</button>
                </div>
                Back to{" "}
                <Link className={classes["link"]} to="/sign-in">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        )}
        {showResetForm === true && (
          <form className={classes["forgot-password-form"]}>
            <h1 className={classes[`forgot-password-form_h1${darkClass}`]}>
              Reset you Password
            </h1>
            <Input
              id="code"
              type="text"
              label="Reset Code"
              placeholder="Enter a valid reset code..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Input
              id="new-password"
              type="password"
              label="New password"
              placeholder="Enter your new password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              id="re-password"
              type="password"
              label="Re-type New Password"
              placeholder="Re-type the above password..."
              value={retypedPassword}
              onChange={(e) => setRetypedPassword(e.target.value)}
            />
            <Button
              style={{ marginTop: "1rem" }}
              type="submit"
              loadingText="Loading"
              text="Reset Password"
              loading={loading}
              onClick={resetPasswordHandler}
            />
            <div className={classes["forgot-password-form_links"]}>
              <div
                className={classes[`forgot-password-form__forgot${darkClass}`]}
              >
                <div className={classes["forgot-password-reset-code"]}>
                  Don't have a reset code?
                  <button onClick={toggleForm}> Request one</button>
                </div>
                Back to{" "}
                <Link className={classes["link"]} to="/sign-in">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        )}
      </Card>
    </CenteredContainer>
  );
};

export default ForgotPassword;
