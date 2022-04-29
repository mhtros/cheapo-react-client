import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Input, Row, Space, Typography } from "antd";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authenticationContext from "../../../context/authentication-context";

const { Text } = Typography;

const Signin = () => {
  const navigate = useNavigate();
  const authenticationCtx = useContext(authenticationContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signinHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await authenticationCtx.signin(email, password);
      setLoading(false);
      navigate("/dashboard");
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Sign in to your Account"
      style={{ minWidth: "20rem", width: "30%", textAlign: "center" }}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Input
          prefix={<UserOutlined />}
          placeholder="Enter your email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Enter your Password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
        <Button
          type="primary"
          loading={loading}
          style={{ width: "100%" }}
          onClick={signinHandler}
        >
          Sign in
        </Button>
        <div style={{ textAlign: "left", fontSize: "0.7rem" }}>
          <Row wrap={false} style={{ paddingRight: "0.5rem" }}>
            <Col flex="auto">
              <Link to="/forgot-password">Forgot your password?</Link>
            </Col>
            <Col flex="none">
              <Link to="/verify-account">Verify Account.</Link>
            </Col>
          </Row>
          <Text>Don't have an account yet?</Text>
          <Link to="/sign-up"> Sign up!</Link>
        </div>
      </Space>
    </Card>
  );
};

export default Signin;
