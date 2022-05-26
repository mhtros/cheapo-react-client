import { MailOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Typography } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUri } from "../../appsettings";
import displayError from "../../helpers/exception-error";
import { successToast } from "../../helpers/toasts";

const { Paragraph } = Typography;

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const forgotPasswordHandler = async (values) => {
    const email = values.email;
    setLoading(true);

    try {
      const url = `${apiUri}/authentication/forgot-password`;
      var response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw await response.json();

      successToast("Reset code was send in: " + email);
      setLoading(false);
      navigate("/reset-password");
    } catch (ex) {
      setLoading(false);
      displayError(ex);
    }
  };

  const title = (
    <Paragraph style={{ textAlign: "center" }}>
      <span>Forgot your password </span>
    </Paragraph>
  );

  return (
    <Card title={title}>
      <Paragraph style={{ textAlign: "center", marginBottom: "2rem" }}>
        If you've lost your password or wish to reset it <br />
        please enter your email to send you a reset code.
      </Paragraph>
      <Form onFinish={forgotPasswordHandler} autoComplete="off">
        <Form.Item name="email">
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>
        <Button
          style={{ width: "100%" }}
          loading={loading}
          type="primary"
          htmlType="submit"
        >
          Request code
        </Button>
      </Form>
      <Paragraph style={{ margin: "1rem 0 0 0" }}>
        <div>
          <span>Already have a reset code? </span>
          <Link to="/reset-password"> Reset.</Link>
        </div>
        Back to <Link to="/sign-in"> Sign in.</Link>
      </Paragraph>
    </Card>
  );
};

export default ForgotPassword;
