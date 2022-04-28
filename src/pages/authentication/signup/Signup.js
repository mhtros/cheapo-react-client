import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUri } from "../../../appsettings";
import CenteredContainer from "../../../components/layout/centered-container/CenteredContainer";
import Button from "../../../components/UI/button/Button";
import Card from "../../../components/UI/card/Card";
import Input from "../../../components/UI/input/Input";
import themeContext from "../../../context/theme-context";
import displayError from "../../../helpers/display-exception-error";
import { errorToast, successToast } from "../../../helpers/toasts";
import classes from "./Signup.module.css";

const Signup = () => {
  const navigate = useNavigate();
  const themeCtx = useContext(themeContext);
  const darkClass = themeCtx.dark ? "--dark" : "";

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [retypedPassword, setRetypedPassword] = useState("");
  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(false);

  const signupHandler = async (event) => {
    event.preventDefault();

    if (password !== retypedPassword) {
      errorToast("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const url = `${apiUri}/authentication/signup`;
      var response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          username,
          ConfirmPassword: retypedPassword,
          image,
        }),
      });

      if (!response.ok) throw await response.json();

      successToast("Account created successfully");
      successToast(
        "You have been sent an activation code in the email " + email
      );

      navigate("/sign-in");
    } catch (ex) {
      setLoading(false);
      displayError(ex);
    }
  };

  const fileChangeHandler = (e) => {
    const file = e.target?.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (evt) => setImage(evt.target.result);
  };

  return (
    <CenteredContainer>
      <Card>
        <form className={classes["signup-form"]}>
          <h1 className={classes[`signup-form_h1${darkClass}`]}>
            Create a new account
          </h1>
          <Input
            id="username"
            type="text"
            label="Username"
            placeholder="Enter a username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            id="email"
            type="text"
            label="Email"
            placeholder="Enter an email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="Enter a password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            id="re-password"
            type="password"
            label="Re-type Password"
            placeholder="Re-type the above password..."
            value={retypedPassword}
            onChange={(e) => setRetypedPassword(e.target.value)}
          />
          <Input
            id="image"
            type="file"
            label="Upload an image"
            onChange={fileChangeHandler}
          />
          <Button
            style={{ marginTop: "1rem" }}
            type="submit"
            loadingText="Loading"
            text="Sign up"
            loading={loading}
            onClick={signupHandler}
          />
          <div className={classes["signup-form_links"]}>
            <div className={classes[`signup-form__forgot${darkClass}`]}>
              Already have an account?{" "}
              <Link className={classes["link"]} to="/sign-in">
                Sign in!
              </Link>
            </div>
          </div>
        </form>
      </Card>
    </CenteredContainer>
  );
};

export default Signup;
