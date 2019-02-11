import Color from 'color';
import {randFloat} from './general';

class DrawingMachine {
    ctx = null;
    pixelSize = 5;
    shadowSize = 1;
    lightSource = {
        x: 0,
        y: 0
    };

    constructor(ctx){
        this.ctx = ctx;
    }

    setPixelSize = (size) => {
        this.pixelSize = size;
    };

    setShadowSize = (size) => {
        this.shadowSize = size;
    };

    drawPixel = (color = 'rgb(0, 0, 0)', x = 0, y = 0, rectConfig = {}) => {
        const { colorVariety = 0 } = rectConfig;
        let fillColor = Color(color);
        if(colorVariety > 0) {
            const variant = randFloat(0, colorVariety);
            if(Math.round(variant * 100) % 2) {
                fillColor = fillColor.lighten(variant);
            } else {
                fillColor = fillColor.darken(variant);
            }
        }
        this.ctx.fillStyle = fillColor.hsl().string();
        this.ctx.fillRect(x, y, this.pixelSize, this.pixelSize);
    };

    removePixel = (x = 0, y = 0) => {
        this.ctx.clearRect(x, y, this.pixelSize, this.pixelSize);
    };

    drawSun(x, y){
        this.lightSource = {x, y};
        this.drawRect('green', x, y, 5, 5);
    }

    drawRect = (color = 'rgb(0, 0, 0)', x = 0, y = 0, w = 1, h = 1, config = {}) => {
        const rectConfig = {
            colorVariety: 0,
            shadow: false, //leftTop, leftBottom, rightBottom, rightTop
            shadowInside: true, //leftTop, leftBottom, rightBottom, rightTop
            ...config
        };
        const x1 = x;
        const x2 = w + x;
        const y1 = y;
        const y2 = h + y;
        const canvasPixelsXCount = Math.round(this.ctx.canvas.width / this.pixelSize);
        const canvasPixelsYCount = Math.round(this.ctx.canvas.height / this.pixelSize);
        for(let xi = x1; xi < x2; xi += 1){
            // const xShadowIntensity = Math.abs((this.lightSource.x - x1) / canvasPixelsXCount) * this.pixelSize;
            const xShadowIntensity = 0.5;
            for(let yi = y1; yi < y2; yi += 1) {
                let shadowPixelDrawn = false;
                // const yShadowIntensity = Math.abs((this.lightSource.y - y1) / canvasPixelsYCount);
                const yShadowIntensity = 0.5;
                // if(rectConfig.shadow){
                //     if(xi > this.lightSource.x) {
                //         if((x2 - xi) === this.shadowSize){
                //             let fillColor = Color(color);
                //             if(!isNaN(xShadowIntensity)){
                //                 fillColor = fillColor.darken(xShadowIntensity);
                //                 shadowPixelDrawn = true;
                //             }
                //             this.drawPixel(fillColor.hsl().string(), xi * this.pixelSize, yi * this.pixelSize, {colorVariety: 0});
                //         }
                //     }else{
                //         if(xi - x1 < this.shadowSize){
                //             let fillColor = Color(color);
                //             if(!isNaN(xShadowIntensity)){
                //                 fillColor = fillColor.darken(xShadowIntensity);
                //                 shadowPixelDrawn = true;
                //             }
                //             this.drawPixel(fillColor.hsl().string(), xi * this.pixelSize, yi * this.pixelSize, {colorVariety: 0});
                //         }
                //     }
                //     if(yi > this.lightSource.y) {
                //         if((y2 - yi) === this.shadowSize){
                //             let fillColor = Color(color);
                //             if(!isNaN(yShadowIntensity)){
                //                 fillColor = fillColor.darken(yShadowIntensity);
                //                 shadowPixelDrawn = true;
                //             }
                //             this.drawPixel(fillColor.hsl().string(), xi * this.pixelSize, yi * this.pixelSize, {colorVariety: 0});
                //         }
                //     }else{
                //         if(yi - y1 < this.shadowSize){
                //             let fillColor = Color(color);
                //             if(!isNaN(yShadowIntensity)){
                //                 fillColor = fillColor.darken(yShadowIntensity);
                //                 shadowPixelDrawn = true;
                //             }
                //             this.drawPixel(fillColor.hsl().string(), xi * this.pixelSize, yi * this.pixelSize, {colorVariety: 0});
                //         }
                //     }
                // }
                if(!shadowPixelDrawn) {
                    this.drawPixel(color, xi * this.pixelSize, yi * this.pixelSize, rectConfig);
                }
            }
        }
    };
}

export default DrawingMachine;
