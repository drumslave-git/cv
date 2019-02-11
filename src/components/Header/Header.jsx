import React from 'react';
import Menu from '../Menu';
import HeaderImage from './HeaderImage';
import style from './Header.less';

const Header = () => (
    <React.Fragment>
        <div className={style.header}>My Header Text</div>
        <HeaderImage/>
        <Menu items={[
            {text: 'home'},
            {text: 'about'},
        ]}/>
    </React.Fragment>
);

export default Header;
