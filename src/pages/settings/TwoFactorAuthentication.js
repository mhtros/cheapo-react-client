import { Alert, Button, Card, Col, Form, Input, Row, Typography } from "antd";
import { QRCodeSVG } from "qrcode.react";
import { useContext, useEffect, useState } from "react";
import { apiUri } from "../../appsettings";
import authenticationContext from "../../context/authentication-context";
import { successToast } from "../../helpers/toasts";
import { useHttp } from "../../hooks/http-hook";

const { Paragraph, Title, Link } = Typography;

const twoFactorTokenStyles = {
  display: "grid",
  placeItems: "center",
  width: 200,
  height: 200,
  background: "#212529",
  borderRadius: "0.175rem",
  color: "#fff",
  fontSize: "1rem",
  wordSpacing: "0.5rem",
  padding: "0.275rem",
  textAlign: "center",
};

const TwoFactorAuthenitcation = () => {
  const { httpCall } = useHttp();

  const authenticationCtx = useContext(authenticationContext);
  const user = authenticationCtx.user;

  const [loading, setLoading] = useState(false);
  const [extraLoading, setExtraLoading] = useState(false);

  const [recoveryKeys, setRecoveryKeys] = useState("");
  const [twoFactorToken, setTwoFactorToken] = useState("");

  useEffect(() => {
    if (!user.twoFactorEnabled) generateTwoFactorKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.twoFactorEnabled]);

  const beautifyToken = (token) => {
    return token
      .toLowerCase()
      .match(/.{1,4}/g)
      .join(" ");
  };

  const generateTwoFactorKey = async () => {
    const url = `${apiUri}/authentication/generate-authenticator-key`;
    try {
      const response = await httpCall(url);
      const token = beautifyToken(response.data.token);
      setTwoFactorToken(token);
    } catch (e) {}
  };

  const enableTwoFactorHandler = async (values) => {
    setLoading(true);
    try {
      const url = `${apiUri}/authentication/enable-two-factor-authentication`;
      const response = await httpCall(url, {
        method: "POST",
        body: JSON.stringify({ token: values.verificationCode }),
      });
      setRecoveryKeys(response.data.recoveryKeys.replaceAll(";", " "));
      successToast("Successfully enabled Two Factor authentication.");
      authenticationCtx.setTwoFactor(true);
      setLoading(false);
    } catch (ex) {
      setLoading(false);
    }
  };

  const disableTwoFactorHandler = async () => {
    setLoading(true);
    try {
      const url = `${apiUri}/authentication/disable-two-factor-authentication`;
      await httpCall(url, { method: "PUT" });
      successToast("Successfully disabled Two Factor authentication.");
      authenticationCtx.setTwoFactor(false);
      setLoading(false);
    } catch (ex) {
      setLoading(false);
    }
  };

  const resetRecoveryCodes = async () => {
    setExtraLoading(true);
    try {
      const url = `${apiUri}/authentication/reset-two-factor-recovery-keys`;
      const response = await httpCall(url);
      setRecoveryKeys(response.data.recoveryKeys.replaceAll(";", " "));
      setExtraLoading(false);
    } catch (ex) {
      setExtraLoading(false);
    }
  };

  const twoFactorEnabledTemplate = (
    <>
      <Paragraph>
        In order to enable the two factor authentication mode, you must first
        configure an authenticator app.
      </Paragraph>

      <Title level={4}>Configure authenicator app</Title>

      <Paragraph>
        To use an authenticator app go through the following steps:
      </Paragraph>

      <Paragraph>
        1. Download a two-factor app like Authy for{" "}
        <Link href="https://play.google.com/store/apps/details?id=com.authy.authy">
          Android{" "}
        </Link>
        and{" "}
        <Link href="https://apps.apple.com/us/app/twilio-authy/id494168017">
          iOS
        </Link>
        .
      </Paragraph>

      <Paragraph>
        2. Scan the QR Code or enter the key (Spaces and casing do not matter)
        into your two factor authenticator app.
      </Paragraph>

      <Row>
        <Col md={24} lg={12}>
          <QRCodeSVG
            style={{ borderRadius: "0.175rem" }}
            width={200}
            height={200}
            value={`otpauth://totp/cheapo_${user.username}?secret=${twoFactorToken}&issuer=Cheapo`}
          />
        </Col>
        <Col xs={24} md={12} style={{ marginBottom: "1rem" }}>
          <div style={twoFactorTokenStyles}>{twoFactorToken}</div>
        </Col>
      </Row>

      <Paragraph>
        3. Once you have scanned the QR code or input the key above, your two
        factor authentication app will provide you with a unique code. Enter the
        code in the confirmation box below.
      </Paragraph>

      <Form onFinish={enableTwoFactorHandler} autoComplete="off">
        <Form.Item name="verificationCode">
          <Input size="large" placeholder="Verification code" />
        </Form.Item>
        <Button
          style={{ width: "100%" }}
          size="large"
          loading={loading}
          type="primary"
          htmlType="submit"
        >
          Enable 2FA
        </Button>
      </Form>
    </>
  );

  const twoFactorDisabledTemplate = (
    <>
      <Paragraph>
        <Title level={4}>Recovery codes</Title>

        <Paragraph>
          If you were to lose access to your 2FA token (lost your phone with
          Authy, master reset, etc.), recovery codes can be used to login to
          your account without the code from your 2FA token.
        </Paragraph>

        <Button
          loading={extraLoading}
          disabled={loading}
          onClick={resetRecoveryCodes}
        >
          Reset Recovery Codes
        </Button>
      </Paragraph>

      {recoveryKeys && (
        <Alert
          style={{ marginBottom: "1rem" }}
          message={<Title level={4}>You have generated recovery codes</Title>}
          description={
            <>
              <Paragraph>
                <b>Put these codes in a safe place.</b> If you lose your device
                and don't have the recovery codes you will lose access to your
                account.
              </Paragraph>
              <div style={{ fontFamily: "monospace" }}>
                {recoveryKeys.toLowerCase().replaceAll(" ", " - ")}
              </div>
            </>
          }
          type="success"
          closable
          onClose={() => setRecoveryKeys("")}
        />
      )}

      <Title level={4}>Disable two factor authenitcation</Title>
      <Paragraph>
        Disabling 2FA automaticaly reset the authenticator app.
      </Paragraph>
      <Button
        type="primary"
        size="large"
        danger
        loading={loading}
        disabled={extraLoading}
        onClick={disableTwoFactorHandler}
      >
        Disable 2FA
      </Button>
    </>
  );

  const title = (
    <div style={{ textAlign: "center" }}>Two Factor Authenitcation</div>
  );

  return (
    <Card title={title}>
      {!user.twoFactorEnabled && twoFactorEnabledTemplate}
      {user.twoFactorEnabled && twoFactorDisabledTemplate}
    </Card>
  );
};

export default TwoFactorAuthenitcation;
