import { UploadOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Typography, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUri } from "../../appsettings";
import displayError from "../../helpers/exception-error";
import { errorToast, successToast } from "../../helpers/toasts";

const { Paragraph } = Typography;

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          username: values.username,
          ConfirmPassword: values.repeatPassword,
          image: fileList?.length > 0 ? fileList[0]?.url : null,
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

  const changeImageHandler = (file) => {
    const isJpeg = file.type === "image/jpeg";
    if (!isJpeg) {
      errorToast(`${file.name} is not a jpeg file`);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setFileList([{ url: reader.result }]);
    };

    // then upload `file` from the argument manually
    return false;
  };

  const title = <div style={{ textAlign: "center" }}>Create a new Account</div>;

  return (
    <Card title={title}>
      <Form labelCol={{ span: 9 }} onFinish={signupHandler}>
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
          <ImgCrop rotate>
            <Upload
              fileList={fileList}
              beforeUpload={changeImageHandler}
              onRemove={() => setFileList([])}
              accept="image/jpeg"
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Select image</Button>
            </Upload>
          </ImgCrop>
        </Form.Item>

        <div style={{ display: "flex", flexDirection: "row-reverse" }}>
          <Button loading={loading} type="primary" htmlType="submit">
            Sign up
          </Button>
        </div>

        <Paragraph style={{ margin: "1rem 0 0 0" }}>
          Already have an account? <Link to="/sign-in"> Sign in!</Link>
        </Paragraph>
      </Form>
    </Card>
  );
};

export default Signup;
