import React, { PureComponent } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

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
    render() {
        const {styles = _styles} = this.props;
        return (
            <ul className={styles.list}>
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
        );
    }
}

SocialIcons.propTypes = {};

export {SocialIcons};
