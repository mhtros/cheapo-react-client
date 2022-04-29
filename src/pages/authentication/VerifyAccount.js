import { MailOutlined } from "@ant-design/icons";
import { Button, Card, Input, Space, Typography } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUri } from "../../appsettings";
import displayError from "../../helpers/display-exception-error";
import { successToast } from "../../helpers/toasts";

const { Text } = Typography;

const VerifyAccount = () => {
  const navigate = useNavigate();

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

      successToast("Verification link was send in: " + email);

      navigate("/sign-in");
    } catch (ex) {
      setLoading(false);
      displayError(ex);
    }
  };

  return (
    <Card
      title="Verify your Account"
      style={{ minWidth: "22rem", textAlign: "center" }}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Input.Group compact>
          <Input
            style={{ width: "70%", textAlign: "left" }}
            prefix={<MailOutlined />}
            placeholder="Enter email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            style={{ width: "30%" }}
            loading={loading}
            type="primary"
            onClick={verifyAccountHandler}
          >
            Send
          </Button>
        </Input.Group>

        <div style={{ textAlign: "left", fontSize: "0.7rem" }}>
          <Text>Back to</Text>
          <Link to="/sign-in"> Sign in.</Link>
        </div>
      </Space>
    </Card>
  );
};

export default VerifyAccount;
