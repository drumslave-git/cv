import React from 'react';
import Menu from '../Menu';
import style from './Header.less';

const Header = () => (
    <React.Fragment>
        <div className={style.header}>My Header Text</div>
        <Menu items={[
            {text: 'home'},
            {text: 'about'},
        ]}/>
    </React.Fragment>
);

export default Header;
