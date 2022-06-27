import { Alert, Button, Card, Input, Popconfirm, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { apiUri } from "../../appsettings";
import authenticationContext from "../../context/authentication-context";
import { successToast } from "../../helpers/toasts";
import { useHttp } from "../../hooks/http-hook";

const { Paragraph } = Typography;

const flexStyle = {
  display: "flex",
  flexDirection: "row-reverse",
  gap: "1rem",
  marginTop: "1rem",
};

const PersonalData = () => {
  const { httpCall } = useHttp();

  const authenticationCtx = useContext(authenticationContext);
  const user = authenticationCtx.user;

  const [downloading, setDownloading] = useState(false);
  const [deleteTokenLoading, setDeleteTokenLoading] = useState(false);

  const [deletionToken, setDeletionToken] = useState("");
  const [deleteLoading, setDeleLoading] = useState(false);
  const [popConfigVisibility, setPopConfigVisibility] = useState(false);

  useEffect(() => {
    document.title = "Cheapo - Personal Data";
  }, []);

  const downloadPersonalData = async () => {
    setDownloading(true);
    try {
      const url = `${apiUri}/user`;
      const response = await httpCall(url);

      const blob = new Blob([JSON.stringify(response.data)], {
        type: "text/plain",
      });

      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(
          blob,
          `${response.data.userName}_personal_data.json`
        );
      } else {
        const elem = window.document.createElement("a");
        elem.href = window.URL.createObjectURL(blob);
        elem.download = `${response.data.userName}_personal_data.json`;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
      }
      setDownloading(false);
    } catch (ex) {
      setDownloading(false);
    }
  };

  const getDeleteToken = async () => {
    setDeleteTokenLoading(true);
    try {
      const url = `${apiUri}/user/delete-token`;
      await httpCall(url);
      setDeleteTokenLoading(false);
      successToast("deletion token was send in: " + user.email);
      setPopConfigVisibility(true);
    } catch (ex) {
      setDeleteTokenLoading(false);
    }
  };

  const deleteAccount = async () => {
    setDeleLoading(true);
    try {
      const url = `${apiUri}/user/${deletionToken}`;
      await httpCall(url, { method: "DELETE" });
      successToast("You account has been deleted ");
      authenticationCtx.signout();
    } catch (ex) {
      setDeleLoading(false);
      clearPopConfirm();
    }
  };

  const clearPopConfirm = () => {
    setPopConfigVisibility(false);
    setDeletionToken("");
  };

  const popconfirmContent = (
    <div style={{ marginRight: "2rem" }}>
      <Paragraph>
        Sure you want to delete your account?
        <br />
        If yes please paste the code that we sent you in your email
      </Paragraph>
      <Input
        placeholder="Deletion token"
        value={deletionToken}
        onChange={(e) => setDeletionToken(e.target.value)}
      />
    </div>
  );

  const title = <div style={{ textAlign: "center" }}>Personal Data</div>;

  return (
    <Card title={title}>
      <Paragraph>
        Your account contains personal data that you have given us. This page
        allows you to download or delte that data.
      </Paragraph>
      <Alert
        message={
          <strong style={{ color: "#ff4d4f" }}>
            Deleting this data will permanently remove your account, and this
            cannot be recovered.
          </strong>
        }
        type="error"
      />
      <div style={flexStyle}>
        <Button
          type="primary"
          loading={downloading}
          onClick={downloadPersonalData}
        >
          Download
        </Button>
        <Popconfirm
          visible={popConfigVisibility}
          placement="bottom"
          title={popconfirmContent}
          onConfirm={deleteAccount}
          onCancel={clearPopConfirm}
          okButtonProps={{ loading: deleteLoading }}
          icon={false}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="primary"
            onClick={getDeleteToken}
            loading={deleteTokenLoading}
            danger
          >
            Delete
          </Button>
        </Popconfirm>
      </div>
    </Card>
  );
};

export default PersonalData;
