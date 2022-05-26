import { Button, Card, Form, Input, Typography } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUri } from "../../appsettings";
import displayError from "../../helpers/exception-error";
import { successToast } from "../../helpers/toasts";

const { Paragraph } = Typography;

const RestPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const resetPasswordHandler = async (values) => {
    setLoading(true);

    try {
      const url = `${apiUri}/authentication/reset-password`;
      var response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  const title = (
    <Paragraph style={{ textAlign: "center" }}>
      <span>Reset your Password</span>
    </Paragraph>
  );

  return (
    <Card title={title}>
      <Form labelCol={{ span: 9 }} onFinish={resetPasswordHandler}>
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
          <Button loading={loading} type="primary" htmlType="submit">
            Reset password
          </Button>
        </div>
        <Paragraph style={{ margin: "1rem 0 0 0" }}>
          <div>
            <span>Don't have a rest code? </span>
            <Link to="/forgot-password"> Request one.</Link>
          </div>
          Back to <Link to="/sign-in"> Sign in.</Link>
        </Paragraph>
      </Form>
    </Card>
  );
};

export default RestPassword;
