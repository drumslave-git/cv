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
    picRef = React.createRef();
    currentRend = 0;

    constructor(props) {
        super(props);
        EE.on('say', this.onSay);
    }

    componentDidMount() {
        this.img = new Image();
        this.img.onload = () => {
            if(this.picRef.current){
                this.picRef.current.style.backgroundImage = `url("${this.img.src}")`;
            }
        };
        setTimeout(() => {
            this.currentRend = getRandomNum();
            this.img.src = `https://api.adorable.io/avatars/90/${this.currentRend}`;

            setInterval(() => {
                this.currentRend = getRandomNum();
                if(this.currentRend % 3 === 0) {
                    this.img.src = `https://api.adorable.io/avatars/90/${this.currentRend}`;
                }else{
                    if(this.picRef.current) {
                        this.picRef.current.style.backgroundImage = '';
                    }
                }
            }, picSwitchDelay)
        }, picSwitchDelay)
    }

    onSay = (msg) => {
        alert(msg);
    };

    onPicClick = () => {
        EE.emit('picClicked');
        this.picRef.current.classList.toggle(style.active);
    };

    render() {
        return (
            <div className={style.menuWrapper}>
                <ul className={style.menu}>{this.props.items.map((item, idx) => <MenuItem key={idx} {...item} />)}</ul>
                <div className={style.I}>
                    <div
                        className={cn(style.picture, "glitchBlock")}
                        ref={this.picRef}
                        onClick={this.onPicClick}
                    />
                </div>
                <SocialIcons/>
            </div>
        )
    }

    componentWillUnmount() {
        EE.off('say', this.onSay);
    }

}

export { Menu };
