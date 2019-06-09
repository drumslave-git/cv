import React from "react";
import cn from 'classnames';

import {EE} from "../../helpers/EE";

import { MenuItem } from "./MenuItem";
import {SocialIcons} from "@/components/SocialIcons";

import style from "./Menu.less";

const getRandomNum = () => {
    return Math.floor(Math.random() * 5000);
};

const picSwitchDelay = 10000;

class Menu extends React.PureComponent {
    img = null;
    picRef = null;
    currentRend = 0;

    state = {
        visibleMenu: window.innerWidth > 700,
    };

    constructor(props) {
        super(props);
        EE.on('say', this.onSay);

        window.addEventListener('resize', this.handleWindowResize);
    }

    componentDidMount() {
        this.img = new Image();
        this.img.onload = () => {
            if(this.picRef){
                this.picRef.style.backgroundImage = `url("${this.img.src}")`;
            }
        };
        setTimeout(() => {
            this.currentRend = getRandomNum();
            this.img.src = `https://api.adorable.io/avatars/90/${this.currentRend}`;

            setInterval(() => {
                requestAnimationFrame(() => {
                    this.currentRend = getRandomNum();
                    if(this.currentRend % 3 === 0) {
                        this.img.src = `https://api.adorable.io/avatars/90/${this.currentRend}`;
                    }else{
                        if(this.picRef) {
                            this.picRef.style.backgroundImage = '';
                        }
                    }
                })
            }, picSwitchDelay)
        }, picSwitchDelay)
    }

    onSay = (msg) => {
        alert(msg);
    };

    onPicClick = () => {
        EE.emit('picClicked');
        this.picRef.classList.toggle(style.active);
    };

    toggleMenu = () => {
        this.setState({visibleMenu: !this.state.visibleMenu})
    };

    handleWindowResize = () => {
        const visibleMenu = window.innerWidth > 700;
        if(this.state.visibleMenu !== visibleMenu){
            this.setState({visibleMenu});
        }
    };

    render() {
        const {visibleMenu} = this.state;
        return (
            <div className={style.menuWrapper}>
                {visibleMenu && (
                    <>
                    <div className={style.humbPlaceholder}>
                        <i className="fas fa-bars"/>
                    </div>
                    <div className={style.overlay} onClick={this.toggleMenu} />
                    </>
                )}
                <ul className={cn(
                    style.menu,
                    {[style.hidden]: !visibleMenu},
                    {[style.visible]: visibleMenu}
                    )}>
                    <li className={style.humb} onClick={this.toggleMenu}>
                        {visibleMenu && (
                            <i className="fas fa-times"/>
                        )}
                        {!visibleMenu && (
                            <i className="fas fa-bars"/>
                        )}
                    </li>
                    {this.props.items.map((item, idx) => <MenuItem
                        key={idx}
                        {...item}
                    />)}
                </ul>
                <div className={style.I}>
                    <div
                        className={cn(style.picture, "glitchBlock")}
                        ref={r => this.picRef = r}
                        onClick={this.onPicClick}
                    />
                </div>
                <SocialIcons/>
            </div>
        )
    }

    componentWillUnmount() {
        EE.off('say', this.onSay);
        window.removeEventListener('resize', this.handleWindowResize);
    }

}

export { Menu };
