import { Button, Card, Form, Input } from "antd";
import React, { useContext, useState } from "react";
import { apiUri } from "../../appsettings";
import authenticationContext from "../../context/authentication-context";
import displayError from "../../helpers/display-exception-error";
import { errorToast, successToast } from "../../helpers/toasts";

const Password = () => {
  const authenticationCtx = useContext(authenticationContext);

  const [loading, setLoading] = useState(false);

  const signupHandler = async (values) => {
    if (values.newPassword !== values.repeatNewPassword) {
      errorToast("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const url = `${apiUri}/authentication/change-password`;
      var response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authenticationCtx.accessToken}`,
        },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          ConfirmPassword: values.repeatNewPassword,
        }),
      });

      if (!response.ok) throw await response.json();

      successToast("Password changed successfully");
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
