import { useContext } from "react";
import themeContext from "../../../context/theme-context";
import CenteredContainer from "../centered-container/CenteredContainer";
import classes from "./PageTemplate.module.css";

const PageTemplate = ({ children }) => {
  const themeCtx = useContext(themeContext);
  const darkClass = themeCtx.dark ? "--dark" : "";

  return (
    <CenteredContainer>
      <div
        className={`${classes["page-template__container"]} ${
          classes[`page-template__background${darkClass}`]
        }`}
      >
        {children}
      </div>
    </CenteredContainer>
  );
};

export default PageTemplate;
