import { useContext } from "react";
import themeContext from "../../../context/theme-context";
import classes from "./Card.module.css";

const Card = ({ children }) => {
  const themeCtx = useContext(themeContext);
  const darkClass = themeCtx.dark ? "--dark" : "";

  return (
    <div
      className={`${classes["card__common"]} ${classes[`card${darkClass}`]}`}
    >
      {children}
    </div>
  );
};

export default Card;
