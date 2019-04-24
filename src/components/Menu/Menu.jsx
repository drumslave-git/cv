import React from "react";
import {MenuItem} from "./MenuItem";
import style from "./Menu.less";

const Menu = (props) => (
  <ul className={style.menu}>{props.items.map((item, idx) => <MenuItem key={idx} {...item} />)}</ul>
);

export { Menu };
