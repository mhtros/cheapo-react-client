import {
  AppstoreOutlined,
  CaretDownOutlined,
  DatabaseOutlined,
  IdcardOutlined,
  LockOutlined,
  LogoutOutlined,
  PieChartOutlined,
  SettingOutlined,
  SplitCellsOutlined,
  TabletOutlined,
  TagsOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Menu, Typography } from "antd";
import { useContext } from "react";
import { Link } from "react-router-dom";
import authenticationContext from "../../context/authentication-context";

const { Title, Text } = Typography;

const Header = () => {
  const authenticationCtx = useContext(authenticationContext);
  const user = authenticationCtx.user;

  const items = [
    {
      icon: <AppstoreOutlined />,
      label: <Link to="dashboard">Dashboard</Link>,
      key: "0",
    },
    {
      icon: <PieChartOutlined />,
      label: <Link to="statistics">Statistics</Link>,
      key: "1",
    },
    {
      icon: <SplitCellsOutlined />,
      label: <Link to="compare">Compare</Link>,
      key: "2",
    },
    {
      icon: <SettingOutlined />,
      label: "Settings",
      children: [
        {
          icon: <IdcardOutlined />,
          label: <Link to="settings/profile">Profile</Link>,
          key: "3-0",
        },
        {
          icon: <LockOutlined />,
          label: <Link to="settings/password">Password</Link>,
          key: "3-1",
        },
        {
          icon: <TagsOutlined />,
          label: (
            <Link to="settings/transaction-categories">
              Transaction categories
            </Link>
          ),
          key: "3-2",
        },
        {
          icon: <TabletOutlined />,
          label: (
            <Link to="settings/two-factor-authentication">
              Two Factor Authentication
            </Link>
          ),
          key: "3-3",
        },
        {
          icon: <DatabaseOutlined />,
          label: <Link to="settings/personal-data">Personal Data</Link>,
          key: "3-4",
        },
      ],
      key: "3",
    },
    {
      type: "divider",
    },
    {
      icon: <LogoutOutlined />,
      label: <Text onClick={() => authenticationCtx.signout()}>Sign out</Text>,
      key: "4",
    },
  ];

  return (
    <div
      style={{
        background: "#fff",
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "0.5rem 1rem",
        marginBottom: "1.5rem",
      }}
    >
      <Avatar
        size={33}
        icon={
          !!user?.image ? (
            <img alt="profile" src={user.image} />
          ) : (
            <UserOutlined />
          )
        }
      />
      <div style={{ flex: "1 1 0%" }}>
        <Title level={4} style={{ margin: 0 }}>
          {user?.username}
        </Title>
        <Text type="secondary">({user?.email})</Text>
      </div>

      <Dropdown
        overlay={<Menu style={{ width: "8rem" }} items={items} />}
        trigger={["click"]}
      >
        <Button>
          <CaretDownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};

export default Header;
