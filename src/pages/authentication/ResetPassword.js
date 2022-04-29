import { Button, Card, Form, Input, Typography } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUri } from "../../appsettings";
import displayError from "../../helpers/display-exception-error";
import { successToast } from "../../helpers/toasts";

const { Text } = Typography;

const RestPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const resetPasswordHandler = async (values) => {
    setLoading(true);

    try {
      const url = `${apiUri}/authentication/reset-password`;
      var response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          ConfirmPassword: values.repeatPassword,
          code: values.code,
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

  return (
    <Card
      title="Reset your Password"
      style={{ minWidth: "20rem", textAlign: "center" }}
    >
      <Form
        labelCol={{ span: 9 }}
        style={{ textAlign: "left" }}
        onFinish={resetPasswordHandler}
      >
        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Repeat Password"
          name="repeatPassword"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label="Reset code" name="code" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <div style={{ display: "flex", flexDirection: "row-reverse" }}>
          <Button
            style={{ width: "40%" }}
            loading={loading}
            type="primary"
            htmlType="submit"
          >
            Reset password
          </Button>
        </div>

        <div style={{ fontSize: "0.7rem" }}>
          <div>
            <Text>Don't have a rest code?</Text>
            <Link to="/forgot-password"> Request one.</Link>
          </div>
          <Text>Back to</Text>
          <Link to="/sign-in"> Sign in.</Link>
        </div>
      </Form>
    </Card>
  );
};

export default RestPassword;
