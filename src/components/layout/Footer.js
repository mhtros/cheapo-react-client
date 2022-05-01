import { Typography } from "antd";

const { Link: Anchor } = Typography;

const Footer = () => {
  return (
    <div
      style={{
        background: "#fff",
        textAlign: "center",
        fontSize: "0.875rem",
        padding: "0.5rem 1rem",
        marginTop: "1rem",
      }}
    >
      © {new Date().getFullYear()} -{" "}
      <Anchor href="https://github.com/mhtros">Panagiotis Mitropanos</Anchor>.
    </div>
  );
};

export default Footer;
