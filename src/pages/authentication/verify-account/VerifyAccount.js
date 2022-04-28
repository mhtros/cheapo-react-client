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
import classes from "./VerifyAccount.module.css";

const VerifyAccount = () => {
  const navigate = useNavigate();
  const themeCtx = useContext(themeContext);
  const darkClass = themeCtx.dark ? "--dark" : "";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyAccountHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const url = `${apiUri}/authentication/resend-confirmation-email`;
      var response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw await response.json();

      successToast(
        "You have been sent an verification link in the email " + email
      );

      navigate("/sign-in");
    } catch (ex) {
      setLoading(false);
      displayError(ex);
    }
  };

  return (
    <CenteredContainer>
      <Card>
        <form className={classes["verify-account-form"]}>
          <h1 className={classes[`verify-account-form_h1${darkClass}`]}>
            Verify your account
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
            text="Send verification email"
            loading={loading}
            onClick={verifyAccountHandler}
          />
          <div className={classes["verify-account-form_links"]}>
            <div className={classes[`verify-account-form__forgot${darkClass}`]}>
              Back to{" "}
              <Link className={classes["link"]} to="/sign-in">
                Sign in
              </Link>
            </div>
          </div>
        </form>
      </Card>
    </CenteredContainer>
  );
};

export default VerifyAccount;
