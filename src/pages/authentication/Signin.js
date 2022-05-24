import { LockOutlined, MailOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Typography,
} from "antd";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authenticationContext from "../../context/authentication-context";

const { Paragraph } = Typography;

const Signin = () => {
  const navigate = useNavigate();
  const authenticationCtx = useContext(authenticationContext);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  const signinHandler = async (values) => {
    const email = values.email;
    const password = values.password;

    setEmail(email);
    setLoading(true);

    try {
      const twoFactorDisabled = await authenticationCtx.signin(email, password);
      if (twoFactorDisabled === false) setTwoFactorEnabled(true);
      if (twoFactorDisabled === true) navigate("/dashboard");
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const twoFactorSigninHandler = async (values) => {
    const token = values.token;
    const recoveryTkn = values.isRecoveryToken;

    setLoading(true);

    try {
      await authenticationCtx.twoFactorSignin(email, token, recoveryTkn);
      setLoading(false);
      navigate("/dashboard");
    } catch (e) {
      setLoading(false);
    }
  };

  const title = (
    <div style={{ textAlign: "center" }}>Sign in to your Account</div>
  );

  const signinForm = (
    <Card title={title}>
      <Form onFinish={signinHandler} autoComplete="off">
        <Form.Item name="email">
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item name="password">
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Button
          style={{ width: "100%" }}
          loading={loading}
          type="primary"
          htmlType="submit"
        >
          Sign in
        </Button>
      </Form>
      <Paragraph style={{ margin: "1rem 0 0 0" }}>
        <Row>
          <Col flex="auto">
            <Link to="/forgot-password">Forgot your password?</Link>
          </Col>
          <Col flex="none">
            <Link to="/verify-account">Verify Account.</Link>
          </Col>
        </Row>
        Don't have an account yet?
        <Link to="/sign-up"> Sign up!</Link>
      </Paragraph>
    </Card>
  );

  const twoFactorTitle = (
    <div style={{ textAlign: "center" }}>
      Your login is protected with an authenticator app.
      <br />
      Enter your authenticator code below.
    </div>
  );

  const twoFactorSigninForm = (
    <Card title={twoFactorTitle}>
      <Form onFinish={twoFactorSigninHandler} autoComplete="off">
        <Form.Item name="token">
          <Input
            placeholder={isRecovery ? "Recovery code" : "Authentication code"}
          />
        </Form.Item>
        <Form.Item name="isRecoveryToken" valuePropName="checked">
          <Checkbox onChange={(e) => setIsRecovery(e.target.checked)}>
            Don't have access to your authenticator device? <br />
            You can log in with a recovery code.
          </Checkbox>
        </Form.Item>
        <Button
          style={{ width: "100%" }}
          loading={loading}
          type="primary"
          htmlType="submit"
        >
          Sign in
        </Button>
      </Form>
    </Card>
  );

  return !twoFactorEnabled ? signinForm : twoFactorSigninForm;
};

export default Signin;
