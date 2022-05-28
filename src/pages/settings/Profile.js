import { InboxOutlined } from "@ant-design/icons";
import { Button, Card, Form, Typography, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import React, { useContext, useState } from "react";
import { apiUri } from "../../appsettings";
import authenticationContext from "../../context/authentication-context";
import { errorToast, successToast } from "../../helpers/toasts";
import { useHttp } from "../../hooks/http-hook";

const { Dragger } = Upload;
const { Paragraph } = Typography;

const Profile = () => {
  const { httpCall } = useHttp();
  const authenticationCtx = useContext(authenticationContext);

  const [loading, setLoading] = useState(false);
  const [extraLoading, setExtraLoading] = useState(false);

  const [fileList, setFileList] = useState([]);

  const updateImageHandler = async () => {
    if (fileList?.length === 0) {
      errorToast("Please select an image");
      return;
    }
    setLoading(true);

    try {
      const url = `${apiUri}/user/image`;
      await httpCall(url, {
        method: "PUT",
        body: JSON.stringify({ Image: fileList[0].url }),
      });
      successToast("Profile image changed successfully");
      authenticationCtx.setImage(fileList[0].url);
      setFileList([]);
      setLoading(false);
    } catch (ex) {
      setLoading(false);
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

  const revokeTokenHandler = async (event) => {
    event.preventDefault();
    setExtraLoading(true);
    try {
      const url = `${apiUri}/authentication/revoke`;
      await httpCall(url, { method: "POST" });
      successToast("Token revoked successfully");
      authenticationCtx.signout();
    } catch (ex) {
      setLoading(false);
    }
  };

  const profileImageTitle = (
    <div style={{ textAlign: "center" }}>Update Profile Image</div>
  );

  const revokeTokenTitle = (
    <div style={{ textAlign: "center" }}>Revoke Token</div>
  );

  return (
    <>
      <Card title={profileImageTitle}>
        <Form onFinish={updateImageHandler}>
          <Form.Item>
            <ImgCrop rotate>
              <Dragger
                fileList={fileList}
                style={{ marginBottom: "0.5rem" }}
                beforeUpload={changeImageHandler}
                onRemove={() => setFileList([])}
                accept="image/jpeg"
                listType="picture"
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Upload an image</p>
                <p className="ant-upload-hint">
                  Click or drag file to this area to upload
                </p>
              </Dragger>
            </ImgCrop>
          </Form.Item>

          <div style={{ display: "flex", flexDirection: "row-reverse" }}>
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              disabled={extraLoading}
            >
              Update
            </Button>
          </div>
        </Form>
      </Card>

      <Card title={revokeTokenTitle} style={{ marginTop: "1rem" }}>
        <Paragraph>
          If you proceed with token revocation you will automatically sign out
          of the application and any further request made with it will be
          rejected.
        </Paragraph>
        <Button
          style={{ width: "100%" }}
          size="large"
          danger
          onClick={revokeTokenHandler}
          loading={extraLoading}
          disabled={loading}
          type="primary"
        >
          Revoke token
        </Button>
      </Card>
    </>
  );
};

export default Profile;
