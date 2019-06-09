import React, { PureComponent } from 'react';
import cn from 'classnames';

import _styles from './SocialIcons.less';

const icons = [
    {
        className: "fa-facebook-f",
        link: "https://www.facebook.com/drumslave0",
        target: "_blank",
        iconType: "fab",
    },
    {
        className: "fa-github",
        link: "https://github.com/drumslave-git",
        target: "_blank",
        iconType: "fab",
    },
    {
        className: "fa-telegram-plane",
        link: "https://t.me/drumslave",
        target: "_blank",
        iconType: "fab",
    },
    {
        className: "fa-linkedin-in",
        link: "https://www.linkedin.com/in/georgetis",
        target: "_blank",
        iconType: "fab",
    },
    {
        className: "fa-skype",
        link: "skype:dru,slave?add",
        target: "_blank",
        iconType: "fab",
    },
    {
        className: "fa-envelope",
        link: "mailto:george.tislenko@gmail.com",
        target: "",
        iconType: "far",
    },
];

class SocialIcons extends PureComponent {
    state = {
        visibleIcons: window.innerWidth > 700
    };

    constructor(props) {
        super(props);

        window.addEventListener('resize', this.handleWindowResize);
    }

    toggleIcons = () => {
        this.setState({
            visibleIcons: !this.state.visibleIcons
        })
    };

    handleWindowResize = () => {
        const visibleIcons = window.innerWidth > 700;
        if(this.state.visibleIcons !== visibleIcons){
            this.setState({visibleIcons});
        }
    };

    render() {
        const {styles = _styles} = this.props;
        const {visibleIcons} = this.state;
        return (
            <>
                {visibleIcons && (
                    <>
                        <div className={styles.iconHumbPlaceholder} onClick={this.toggleIcons}>
                            <i className="fas fa-share-alt"/>
                        </div>
                        <div className={styles.overlay} onClick={this.toggleIcons} />
                    </>
                )}
                <ul className={cn(
                    styles.list,
                    {[styles.visible]: visibleIcons}
                )}>
                    <li className={cn(styles.icon, styles.iconHumb)} onClick={this.toggleIcons}>
                        {visibleIcons && (
                            <i className="fas fa-times"/>
                        )}
                        {!visibleIcons && (
                            <i className="fas fa-share-alt"/>
                        )}
                    </li>
                    {icons.map(icon => {
                        return(
                            <li key={icon.className} className={styles.icon}>
                                <a href={icon.link} target={icon.target}>
                                    <i className={cn(
                                        icon.iconType,
                                        icon.className,
                                        "fa-1x",
                                        "glitchText"
                                    )}/>
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </>
        );
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
    }
}

export {SocialIcons};
