import classes from "./CenteredContainer.module.css";

const CenteredContainer = ({ children }) => (
  <div className={classes["centered-container"]}>{children}</div>
);

export default CenteredContainer;
