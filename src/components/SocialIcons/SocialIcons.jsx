import React, { PureComponent } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import _styles from './SocialIcons.less';

const icons = [
    {
        className: "fa-facebook-f",
        iconType: "fab",
    },
    {
        className: "fa-github",
        iconType: "fab",
    },
    {
        className: "fa-telegram-plane",
        iconType: "fab",
    },
    {
        className: "fa-linkedin-in",
        iconType: "fab",
    },
    {
        className: "fa-skype",
        iconType: "fab",
    },
    {
        className: "fa-envelope",
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
                            <i className={cn(
                                icon.iconType,
                                icon.className,
                                "fa-1x",
                                "glitchText"
                            )}/>
                        </li>
                    )
                })}
            </ul>
        );
    }
}

SocialIcons.propTypes = {};

export {SocialIcons};
