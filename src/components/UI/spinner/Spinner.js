import classes from "./Spinner.module.css";

const Spinner = ({ color }) => {
  return (
    <div className={classes["lds-ellipsis"]}>
      <div style={{ background: color }}></div>
      <div style={{ background: color }}></div>
      <div style={{ background: color }}></div>
      <div style={{ background: color }}></div>
    </div>
  );
};

export default Spinner;
