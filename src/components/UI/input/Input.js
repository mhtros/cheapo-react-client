import React, { useContext, useState } from "react";
import themeContext from "../../../context/theme-context";
import classes from "./Input.module.css";

/**
 * Custom input component.
 * @param {*} id - Input identifier.
 * @param {*} label - Input label text.
 * @param {*} style - Input custom styles.
 * @param {*} name - Inpur name.
 * @param {*} type - Input type.
 * @param {*} value - Input value.
 * @param {*} placeholder - Input placeholder.
 * @param {*} onChange - Input onChange event handler.
 * @param {*} autoComplete - Input autocomplete.
 * @param {*} required - Input required.
 * @param {*} otherProperties - Object of missing input attributes.
 * @param {*} showPassword - If set to true display show/hide password button.
 */
const Input = React.forwardRef(
  (
    {
      id,
      label,
      style,
      name,
      type,
      value,
      placeholder,
      onChange,
      autoComplete,
      required,
      otherProperties,
      showPassword,
    },
    ref
  ) => {
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const themeCtx = useContext(themeContext);
    const darkClass = themeCtx.dark ? "--dark" : "";

    const showHideHandler = (e) => {
      e.preventDefault();
      setPasswordVisibility((prev) => !prev);
    };

    return (
      <div>
        <label
          className={`${classes["label_common"]} ${
            classes[`label${darkClass}`]
          }`}
          htmlFor={id}
        >
          {label}
          {showPassword && (
            <button
              className={classes["label_button"]}
              onClick={showHideHandler}
            >
              {passwordVisibility ? "hide" : "show"}
            </button>
          )}
        </label>
        <input
          id={id}
          style={style}
          ref={ref}
          name={name}
          type={
            showPassword ? (passwordVisibility ? "text" : "password") : type
          }
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          {...otherProperties}
          className={`${classes["input__common"]} ${
            classes[`input${darkClass}`]
          }`}
        />
      </div>
    );
  }
);

export default Input;
