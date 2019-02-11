import Color from 'color';
import {randFloat} from './general';

class DrawingMachine {
    ctx = null;
    pixelSize = 10;
    shadowSize = 1;
    numRows = 0;
    numCols = 0;
    lightSource = {
        x: 0,
        y: 0
    };
    canvasData = [];
    dirtyIndexes=[];
    baseColor = 'black';
    eraseColor = 'transparent';

    constructor(ctx){
        this.ctx = ctx;
        this.ctx.imageSmoothingEnabled = false;
        this.numRows =  Math.floor(this.ctx.canvas.height / this.pixelSize);
        this.numCols =  Math.floor(this.ctx.canvas.width / this.pixelSize);
    }

    setGridDimension(w = this.ctx.canvas.width, h = this.ctx.canvas.height){
        this.numRows =  Math.floor(h / this.pixelSize);
        this.numCols =  Math.floor(w / this.pixelSize);
    }

    setPixelSize = (size) => {
        this.pixelSize = size;
    };

    setShadowSize = (size) => {
        this.shadowSize = size;
    };

    isValidRow = (row) => row >= 0 && row <= this.numCols - 1;
    isValidCol = (col) => col >= 0 && col <= this.numCols - 1;

    idxToRowCol = (idx) => {
        const {0: col, 1: row} = idx.split('X');
        return {row: Number(row), col: Number(col)};
    };

    coordsToIdx = (X, Y) => {
        let col = Math.floor(X / this.pixelSize);
        let row = Math.floor(Y / this.pixelSize);

        return `${col}X${row}`;
    };

    drawPixel = (x, y, color = this.eraseColor, virtual = false) => {
        if ((x >= this.ctx.canvas.width || x <=0 ) || (y >= this.ctx.canvas.height || y <= 0)) { return false; }
        return this.setData(this.coordsToIdx(x, y), color, virtual);
    };

    setData = (idx, color = this.baseColor, virtual = false) => {
        if (this.dirtyIndexes.includes(idx)) { return false; }

        this.canvasData[idx] = color;
        if(!virtual) {
            this.dirtyIndexes.push(idx);
        }
        return {idx, color};
    };

    colorBox = (box, color = this.baseColor) => {
        const { row, col } = box;
        if (!this.isValidCol(col) || !this.isValidRow(row)) { return false; }
        this.ctx.fillStyle = color;
        this.ctx.clearRect(col*this.pixelSize, row*this.pixelSize, this.pixelSize, this.pixelSize - 1);
        this.ctx.beginPath();
        this.ctx.fillRect(col*this.pixelSize, row*this.pixelSize, this.pixelSize, this.pixelSize);
        this.ctx.closePath();
        this.reOutline(row, col);
    };

    reOutline = (row, col) => {
        this.ctx.lineWidth = 1;
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.translate(0.5, 0.5); //pad and decimal place
        this.ctx.strokeStyle = 'rgb(200,200,200)';
        //draw vertical line HEIGHT length, x=i
        // this.ctx.beginPath();
        // this.ctx.moveTo(col*this.pixelSize, row*this.pixelSize);
        // this.ctx.lineTo((col + 1)*this.pixelSize, row*this.pixelSize);
        // this.ctx.stroke();
        // this.ctx.closePath();
        this.ctx.beginPath();
        this.ctx.moveTo(col*this.pixelSize, row*this.pixelSize);
        this.ctx.lineTo(col*this.pixelSize, (row+1)*this.pixelSize);
        this.ctx.stroke();
        this.ctx.lineTo((col+1)*this.pixelSize, (row+1)*this.pixelSize);
        this.ctx.stroke();
        this.ctx.lineTo((col+1)*this.pixelSize, row*this.pixelSize);
        this.ctx.stroke();
        this.ctx.lineTo(col*this.pixelSize, row*this.pixelSize);
        this.ctx.stroke();
        this.ctx.closePath();
    };

    drawData = (once = false) => {
        for (let i=0; i < this.dirtyIndexes.length ; i++) {
            let color = this.canvasData[this.dirtyIndexes[i]];
            this.colorBox(this.idxToRowCol(this.dirtyIndexes[i]), color);
        }
        this.dirtyIndexes=[];
        if(!once) {
            requestAnimationFrame(() => this.drawData());
        }
    };

    drawGrid () {
        for(let x = 0; x <= this.numCols; x +=1 ){
            for(let y = 0; y <= this.numRows; y += 1){
                const idx = `${x}X${y}`;
                this.dirtyIndexes.push(idx);
                this.canvasData[idx] = this.eraseColor;
            }
        }
    }

    // drawPixel = (color = 'rgb(0, 0, 0)', x = 0, y = 0, rectConfig = {}) => {
    //     const { colorVariety = 0 } = rectConfig;
    //     let fillColor = Color(color);
    //     if(colorVariety > 0) {
    //         const variant = randFloat(0, colorVariety);
    //         if(Math.round(variant * 100) % 2) {
    //             fillColor = fillColor.lighten(variant);
    //         } else {
    //             fillColor = fillColor.darken(variant);
    //         }
    //     }
    //     this.ctx.fillStyle = fillColor.hsl().string();
    //     this.ctx.fillRect(x, y, this.pixelSize, this.pixelSize);
    // };

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
