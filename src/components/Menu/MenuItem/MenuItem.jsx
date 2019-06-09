import React from "react";
import { Link } from "react-router-dom";
import cn from 'classnames';

import style from "./MenuItem.less";

const MenuItem = (props) => (
  <li className={cn(style.menuItem, 'glitchText', props.className)}>
      <Link to={props.to}>{props.label}</Link>
  </li>
);

export {MenuItem};
