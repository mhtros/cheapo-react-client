import { UploadOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Typography, Upload } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUri } from "../../appsettings";
import displayError from "../../helpers/display-exception-error";
import { errorToast, successToast } from "../../helpers/toasts";

const { Text } = Typography;

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");

  const signupHandler = async (values) => {
    if (values.password !== values.repeatPassword) {
      errorToast("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const url = `${apiUri}/authentication/signup`;
      var response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          username: values.username,
          ConfirmPassword: values.repeatPassword,
          image: image === "" ? null : image,
        }),
      });

      if (!response.ok) throw await response.json();

      successToast("Account created successfully");
      successToast("Verification link was send in: " + values.email);

      navigate("/sign-in");
    } catch (ex) {
      setLoading(false);
      displayError(ex);
    }
  };

  const CheckIfJpeg = (file) => {
    const isJpeg = file.type === "image/jpeg";
    if (!isJpeg) errorToast(`${file.name} is not a jpeg file`);
    return isJpeg || Upload.LIST_IGNORE;
  };

  const changeImageHandler = ({ file, onSuccess }) => {
    setTimeout(() => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (evt) => setImage(evt.target.result);
      onSuccess("ok");
    }, 0);
  };

  return (
    <Card
      title="Create a new Account"
      style={{ minWidth: "20rem", textAlign: "center" }}
    >
      <Form
        labelCol={{ span: 9 }}
        style={{ textAlign: "left" }}
        onFinish={signupHandler}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

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

        <Form.Item label="Upload an image">
          <Upload
            onRemove={() => setImage("")}
            beforeUpload={CheckIfJpeg}
            customRequest={changeImageHandler}
            maxCount={1}
            accept="image/jpeg"
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Select image</Button>
          </Upload>
        </Form.Item>

        <div style={{ display: "flex", flexDirection: "row-reverse" }}>
          <Button
            style={{ width: "40%" }}
            loading={loading}
            type="primary"
            htmlType="submit"
          >
            Sign up
          </Button>
        </div>

        <span style={{ fontSize: "0.7rem" }}>
          <Text>Already have an account?</Text>
          <Link to="/sign-in"> Sign in!</Link>
        </span>
      </Form>
    </Card>
  );
};

export default Signup;
