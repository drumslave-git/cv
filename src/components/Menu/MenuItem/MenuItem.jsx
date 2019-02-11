import React from "react";
import style from "./MenuItem.less";

const MenuItem = (props) => (
  <li className={style.menuItem}>{props.text}</li>
);

export default MenuItem;