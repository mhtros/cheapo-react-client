import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Result } from "antd";
import { Link } from "react-router-dom";
import Robot404 from "../components/svgs/Robot404";

const linkStyle = {
  fontSize: "10px",
  color: "var(--base-color-300)",
  display: "flex",
  flexDirection: "row-reverse",
};

const NotFound = () => (
  <Card>
    <Result
      icon={<Robot404 />}
      title="Uh oh..."
      subTitle="We couldn't find the page you were looking for!"
      extra={
        <Button size="large" type="primary">
          <Link to="dashboard">
            <ArrowLeftOutlined /> Go to dashboard
          </Link>
        </Button>
      }
    />
    <a
      style={linkStyle}
      href="https://storyset.com/web"
      target="_blank"
      rel="noreferrer"
    >
      Web illustrations by Storyset
    </a>
  </Card>
);

export default NotFound;
