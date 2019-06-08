import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import _styles from './Panel.less';

class Panel extends PureComponent {
    render() {
        const {styles = _styles} = this.props;
        let marginTop = 'marginTopSmall';
        switch (this.props.marginTop) {
            case 'big':
                marginTop = 'marginTopBig';
                break;
            case 'medium':
                marginTop = 'marginTopMedium';
                break;
            case 'small':
                marginTop = 'marginTopSmall';
                break;
        }
        return (
            <div className={
                cn(
                    styles.panel,
                    styles[marginTop],
                    {[styles.topLine]: this.props.topLine},
                    this.props.className,
                )
            }>
                {this.props.title && (
                    <div className={styles.title}>{this.props.title}</div>
                )}
                {this.props.children}
            </div>
        );
    }
}

Panel.propTypes = {
    topLine: PropTypes.bool,
    title: PropTypes.string,
    className: PropTypes.string,
    marginTop: PropTypes.oneOf(['big', 'medium', 'small']),
};

export {Panel};
