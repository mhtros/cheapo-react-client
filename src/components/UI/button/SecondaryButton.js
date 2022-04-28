import React, { Fragment, useContext } from "react";
import themeContext from "../../../context/theme-context";
import Spinner from "../spinner/Spinner";
import classes from "./SecondaryButton.module.css";

const SecondaryButton = React.forwardRef(
  (
    { loading, text, type, loadingText, onClick, style, otherProperties },
    ref
  ) => {
    const themeCtx = useContext(themeContext);
    const darkClass = themeCtx.dark ? "--dark" : "";
    const color = themeCtx.dark ? "#fff" : "var(--base-color-700)";

    return (
      <Fragment>
        {!loading && (
          <button
            ref={ref}
            type={type}
            style={style}
            onClick={onClick}
            {...otherProperties}
            className={`${classes["button__common"]} ${
              classes[`button${darkClass}`]
            }`}
          >
            {text}
          </button>
        )}
        {loading && (
          <div className={classes["loading-container"]}>
            <span
              style={{ fontSize: "1rem", fontWeight: "bold", color: color }}
            >
              {loadingText}
            </span>
            <Spinner color={color} />
          </div>
        )}
      </Fragment>
    );
  }
);

export default SecondaryButton;
