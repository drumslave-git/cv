import React from "react";
import style from "./MenuItem.less";
import { Link } from "react-router-dom";

const MenuItem = (props) => (
  <li className={style.menuItem}>
      <Link to={props.to}>{props.label}</Link>
  </li>
);

export {MenuItem};
