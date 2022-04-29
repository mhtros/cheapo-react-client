import { Space, Typography } from "antd";
import CenteredContainer from "../../../components/layout/centered-container/CenteredContainer";

const { Text, Title } = Typography;

const UnauthorizePageTemplate = ({ children }) => (
  <CenteredContainer>
    <div>
      <Space
        direction="vertical"
        style={{ textAlign: "center", marginBottom: "2rem", width: "100%" }}
      >
        <Title style={{ margin: 0 }}>CHEAPO</Title>
        <Text>A simple way to keep track your monthly expenses.</Text>
      </Space>
      {children}
    </div>
  </CenteredContainer>
);

export default UnauthorizePageTemplate;
