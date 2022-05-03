import { Button, Card, Form, Input } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { apiUri } from "../../appsettings";
import displayError from "../../helpers/display-exception-error";
import { errorToast, successToast } from "../../helpers/toasts";

const Password = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const signupHandler = async (values) => {
    if (values.newPassword !== values.repeatNewPassword) {
      errorToast("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const url = `${apiUri}/authentication/change-password`;
      await axios.put(url, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        ConfirmPassword: values.repeatNewPassword,
      });
      successToast("Password changed successfully");
      form.resetFields();
      setLoading(false);
    } catch (ex) {
      setLoading(false);
      displayError(ex);
    }
  };

  return (
    <Card
      title="Change Password"
      style={{ minWidth: "20rem", marginTop: "1rem", textAlign: "center" }}
    >
      <Form
        form={form}
        labelCol={{ span: 9 }}
        style={{ textAlign: "left" }}
        onFinish={signupHandler}
      >
        <Form.Item
          label="Current Password"
          name="currentPassword"
          rules={[{ required: true }]}
        >
          <Input />
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
          <Button
            style={{ width: "40%" }}
            loading={loading}
            type="primary"
            htmlType="submit"
          >
            Update
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default Password;
