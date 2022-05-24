import { Space, Typography } from "antd";

const { Text, Title } = Typography;

const centeredStyles = {
  height: "100%",
  display: "grid",
  placeItems: "center",
};

const CenteredContainer = ({ children }) => (
  <div style={centeredStyles}>{children}</div>
);

const labelStyle = { textAlign: "center", marginBottom: "2rem", width: "100%" };

const UnauthorizePageTemplate = ({ children }) => (
  <CenteredContainer>
    <div id="unauthorize-template">
      <Space direction="vertical" style={labelStyle}>
        <Title style={{ margin: 0, color: "#fff" }}>CHEAPO</Title>
        <Text style={{ color: "#fff" }}>
          A simple way to keep track your monthly expenses.
        </Text>
      </Space>
      {children}
    </div>
  </CenteredContainer>
);

export default UnauthorizePageTemplate;
