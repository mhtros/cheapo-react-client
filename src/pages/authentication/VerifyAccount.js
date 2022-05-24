import { MailOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Typography } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUri } from "../../appsettings";
import displayError from "../../helpers/display-exception-error";
import { successToast } from "../../helpers/toasts";

const { Paragraph } = Typography;

const VerifyAccount = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const verifyAccountHandler = async (values) => {
    setLoading(true);

    try {
      const url = `${apiUri}/authentication/resend-confirmation-email`;
      var response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });

      if (!response.ok) throw await response.json();

      successToast("Verification link was send in: " + values.email);
      navigate("/sign-in");
    } catch (ex) {
      setLoading(false);
      displayError(ex);
    }
  };

  const title = <div style={{ textAlign: "center" }}>Verify your Account</div>;

  return (
    <Card title={title}>
      <Paragraph style={{ textAlign: "center", marginBottom: "2rem" }}>
        To start exploring the Cheapo platform <br />
        please confirm your email address.
      </Paragraph>
      <Form onFinish={verifyAccountHandler} autoComplete="off">
        <Form.Item name="email">
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>
        <Button
          style={{ width: "100%" }}
          loading={loading}
          type="primary"
          htmlType="submit"
        >
          Verify
        </Button>
      </Form>
      <Paragraph style={{ margin: "1rem 0 0 0" }}>
        Back to <Link to="/sign-in"> Sign in.</Link>
      </Paragraph>
    </Card>
  );
};

export default VerifyAccount;
