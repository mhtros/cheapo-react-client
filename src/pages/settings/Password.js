import { Button, Card, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { apiUri } from "../../appsettings";
import { errorToast, successToast } from "../../helpers/toasts";
import { useHttp } from "../../hooks/http-hook";

const Password = () => {
  const { httpCall } = useHttp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Cheapo - Change Password";
  }, []);

  const changePasswordHandler = async (values) => {
    if (values.newPassword !== values.repeatNewPassword) {
      errorToast("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const url = `${apiUri}/authentication/change-password`;
      await httpCall(url, {
        method: "PUT",
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          ConfirmPassword: values.repeatNewPassword,
        }),
      });
      successToast("Password changed successfully");
      form.resetFields();
      setLoading(false);
    } catch (ex) {
      setLoading(false);
    }
  };

  const title = <div style={{ textAlign: "center" }}>Change Password</div>;

  return (
    <Card title={title}>
      <Form form={form} labelCol={{ span: 9 }} onFinish={changePasswordHandler}>
        <Form.Item
          label="Current Password"
          name="currentPassword"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Repeat New Password"
          name="repeatNewPassword"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <div style={{ display: "flex", flexDirection: "row-reverse" }}>
          <Button loading={loading} type="primary" htmlType="submit">
            Update
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default Password;
