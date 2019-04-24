import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {Menu} from "../Menu";

class Main extends PureComponent {
    menuItems = [
        {
            to: '/',
            'label': 'Home'
        },
        {
            to: '/pixelPaint/',
            'label': 'PixelPaint'
        },
    ];
    render() {
        return (
            <div>
                <Menu
                    items={this.menuItems}
                />
                <div>
                    content goes here
                </div>
            </div>
        );
    }
}

Main.propTypes = {};

export {Main};
