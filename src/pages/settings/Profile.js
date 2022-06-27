import { InboxOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Popconfirm,
  Select,
  Typography,
  Upload,
} from "antd";
import ImgCrop from "antd-img-crop";
import { useContext, useEffect, useState } from "react";
import { apiUri } from "../../appsettings";
import authenticationContext from "../../context/authentication-context";
import currencyContext from "../../context/currency-context";
import { errorToast, successToast } from "../../helpers/toasts";
import { useHttp } from "../../hooks/http-hook";
import { Currencies } from "../../maps/currencies";
import { Locales } from "../../maps/locales";

const { Dragger } = Upload;
const { Option } = Select;
const { Paragraph } = Typography;

const Profile = () => {
  const { httpCall } = useHttp();

  const currencyCtx = useContext(currencyContext);
  const authenticationCtx = useContext(authenticationContext);

  const [profileLoading, setProfileLoading] = useState(false);
  const [revokeLoading, setRevokeLoading] = useState(false);

  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    document.title = "Cheapo - Profile";
  }, []);

  const updateImageHandler = async () => {
    if (fileList?.length === 0) {
      errorToast("Please select an image");
      return;
    }
    setProfileLoading(true);

    try {
      const url = `${apiUri}/user/image`;
      await httpCall(url, {
        method: "PUT",
        body: JSON.stringify({ Image: fileList[0].url }),
      });
      successToast("Profile image changed successfully");
      authenticationCtx.setImage(fileList[0].url);
      setFileList([]);
      setProfileLoading(false);
    } catch (ex) {
      setProfileLoading(false);
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
    setRevokeLoading(true);
    try {
      const url = `${apiUri}/authentication/revoke`;
      await httpCall(url, { method: "POST" });
      successToast("Token revoked successfully");
      authenticationCtx.signout();
    } catch (ex) {
      setRevokeLoading(false);
    }
  };

  const profileImageTitle = (
    <div style={{ textAlign: "center" }}>Update Profile Image</div>
  );

  const revokeTokenTitle = (
    <div style={{ textAlign: "center" }}>Revoke Token</div>
  );

  const currencyTitle = (
    <div style={{ textAlign: "center" }}>Currency Format and Locale</div>
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
              loading={profileLoading}
              type="primary"
              htmlType="submit"
              disabled={revokeLoading}
            >
              Update
            </Button>
          </div>
        </Form>
      </Card>

      <Card title={currencyTitle} style={{ marginTop: "1rem" }}>
        <Paragraph>
          Set your individual currency, and locale. These values will affect the
          display format of all numeric values in the application.
        </Paragraph>

        <div>
          <label htmlFor="locales" style={{ display: "block" }}>
            Application Locale
          </label>
          <Select
            id="locales"
            style={{ width: "100%" }}
            showSearch
            value={currencyCtx.locale}
            onChange={(value) => currencyCtx.setLocale(value)}
            placeholder="Search locales..."
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {Locales?.map((locale) => (
              <Option key={locale.code} value={locale.code}>
                {`${locale.code} - ${locale.name} (${locale.nativeName})`}
              </Option>
            ))}
          </Select>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label htmlFor="currencies" style={{ display: "block" }}>
            Application Currency
          </label>
          <Select
            id="currencies"
            style={{ width: "100%" }}
            showSearch
            value={currencyCtx.currency}
            onChange={(value) => currencyCtx.setCurrency(value)}
            placeholder="Search currencies..."
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {Currencies?.map((currency) => (
              <Option key={currency.code} value={currency.code}>
                {currency.code + "-" + currency.name}
              </Option>
            ))}
          </Select>
        </div>
      </Card>

      <Card title={revokeTokenTitle} style={{ marginTop: "1rem" }}>
        <Paragraph>
          If you proceed with token revocation you will automatically sign out
          of the application and any further request made with it will be
          rejected.
        </Paragraph>

        <Popconfirm
          title="Sure you want to revoke the current token?"
          onConfirm={revokeTokenHandler}
          okText="Yes"
          cancelText="No"
        >
          <Button
            style={{ width: "100%" }}
            size="large"
            danger
            loading={revokeLoading}
            disabled={profileLoading}
            type="primary"
          >
            Revoke token
          </Button>
        </Popconfirm>
      </Card>
    </>
  );
};

export default Profile;
