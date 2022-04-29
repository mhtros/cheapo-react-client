import { InfoCircleOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Card, Input, Space, Tooltip, Typography } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUri } from "../../../appsettings";
import displayError from "../../../helpers/display-exception-error";
import { successToast } from "../../../helpers/toasts";

const { Text } = Typography;

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const forgotPasswordHandler = async (e) => {
    e.preventDefault();
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

      successToast("Reset code was send in: " + email);
      setLoading(false);
      navigate("/reset-password");
    } catch (ex) {
      setLoading(false);
      displayError(ex);
    }
  };

  return (
    <Card
      title={
        <Text>
          Forgot your password
          <Tooltip title="Sends a request code email">
            {" "}
            <InfoCircleOutlined style={{ color: "#666" }} />
          </Tooltip>
        </Text>
      }
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
            onClick={forgotPasswordHandler}
          >
            Send
          </Button>
        </Input.Group>

        <div style={{ textAlign: "left", fontSize: "0.7rem" }}>
          <div>
            <Text>Already have a reset code?</Text>
            <Link to="/reset-password"> Reset.</Link>
          </div>
          <Text>Back to</Text>
          <Link to="/sign-in"> Sign in.</Link>
        </div>
      </Space>
    </Card>
  );
};

export default ForgotPassword;
