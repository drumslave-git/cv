import React from 'react';
import DrawingMachine from '../../../helpers/DrawingMachine';
import PixelGrid from './PixelGrid';

class PixelCanvas extends React.PureComponent {
    constructor(props, context) {
        super(props, context);

        this.dm = null;
        this.canvasElRef = null;
        this.containerRef = React.createRef();

        this.canvasRef = (ref) => {
            this.canvasElRef = ref;
            if(ref) {
                const ctx = ref.getContext('2d');
                this.dm = new DrawingMachine(ctx);
            }
        };

        this.mouseButton = 0;
        this.mouseMoveStart = [0,0];
        this.canvasTranslate = [0, 0];
    }

    componentDidMount() {
        this.canvasElRef.addEventListener('wheel', this.changeCanvasScale);
        this.canvasElRef.addEventListener('mousedown', this.startDraw);
        this.canvasElRef.addEventListener('mouseup', this.stopDraw);
        this.canvasElRef.addEventListener('contextmenu', (e) => e.preventDefault());

        this.draw(true);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.draw();
    }

    moveCanvas = (e) => {
        const {pageX, pageY} = e;
        const deltaX = this.mouseMoveStart[0] - pageX;
        const deltaY = this.mouseMoveStart[1] - pageY;
        console.log('moveCanvas', deltaX, deltaY);
        this.mouseMoveStart = [pageX, pageY];
        this.canvasTranslate = [this.canvasTranslate[0] - deltaX, this.canvasTranslate[1] - deltaY];
        if(this.state.canvasScale > 1) {
            this.setState({
                canvasTranslate: this.canvasTranslate
            })
        }
    };

    changeCanvasScale = (e) => {
        const {deltaY} = e;
        const nextState = {
            canvasScale: 1
        };
        if(deltaY > 0){
            nextState.canvasScale = Math.max(1, this.state.canvasScale - 0.5);
        }else{
            nextState.canvasScale =  this.state.canvasScale + 0.5;
        }
        if(nextState.canvasScale === 1){
            nextState['canvasTranslate'] = [0,0];
        }
        this.setState(nextState);
    };

    startDraw = (e) => {
        this.mouseMoveStart = [e.pageX, e.pageY];
        this.mouseButton = e.button;
        if(this.mouseButton === 2) {
            e.preventDefault();
        }
        this.canvasElRef.addEventListener('mousemove', this.drawPixel);
        this.canvasElRef.removeEventListener('click', this.drawPixel);
    };

    stopDraw = () => {
        this.canvasElRef.removeEventListener('mousemove', this.drawPixel);
        this.canvasElRef.addEventListener('click', this.drawPixel);
    };
    drawPixel = (e) => {
        const {
            canDraw = null,
            getColor,
            savePixel = () => {},
        } = this.props;
        const {offsetX: x, offsetY: y} = e;
        let virtualDraw = false;
        let color = this.dm.baseColor;
        if(typeof getColor === 'function'){
            color = getColor();
        }
        const pixel = this.dm.drawPixel(x, y, color, virtualDraw);
        savePixel(pixel);
    };
    // drawPixel = (e) => {
    //     const {offsetX: x, offsetY: y} = e;
    //     this.pixels[this.state.currentLayer] = this.pixels[this.state.currentLayer] || {};
    //     if(!this.state.colorPickerActive) {
    //         switch (this.mouseButton) {
    //             case 0:
    //                 let virtualDraw = false;
    //                 const curLayerOrder = this.state.layersOrder.indexOf(this.state.currentLayer);
    //                 if(curLayerOrder !== 0){
    //                     const idx = this.dm.coordsToIdx(x, y);
    //                     for(let o = 0; o < curLayerOrder; o++) {
    //                         const layerId = this.state.layersOrder[o];
    //                         if (!this.state.hiddenLayers.includes(layerId)){
    //                             if (this.pixels[layerId] && this.pixels[layerId][idx]) {
    //                                 virtualDraw = true;
    //                                 break;
    //                             }
    //                         }
    //                     }
    //                 }
    //                 const pixel = this.dm.drawPixel(x, y, this.state.color, virtualDraw);
    //                 this.pixels[this.state.currentLayer][pixel.idx] = {x, y, color: pixel.color};
    //                 this.savePixels();
    //                 break;
    //             case 1:
    //                 this.moveCanvas(e);
    //                 break;
    //             case 2:
    //                 const idx = this.dm.coordsToIdx(x, y);
    //                 if (this.pixels[this.state.currentLayer][idx]) {
    //                     this.dm.drawPixel(
    //                         x,
    //                         y
    //                     );
    //                     this.pixels[this.state.currentLayer][idx] = null;
    //                 }
    //                 this.savePixels();
    //         }
    //     }else{
    //         if(this.pixels[this.state.currentLayer][`${x},${y}`]){
    //             this.setState({
    //                 color: this.pixels[this.state.currentLayer][`${x},${y}`].color,
    //                 colorPickerActive: false
    //             })
    //         }else{
    //             this.setState({
    //                 color: this.state.canvasColor,
    //                 colorPickerActive: false
    //             })
    //         }
    //     }
    // };

    draw() {
        const {pixels = {}} = this.props;
        if(this.dm && this.containerRef && this.canvasElRef){
            this.canvasElRef.width = this.containerRef.current.clientWidth;
            this.canvasElRef.height = this.containerRef.current.clientHeight;
            this.dm.setGridDimension();

            this.dm.drawData();

            Object.keys(pixels).filter(pixel => pixels[pixel] !== null).forEach(pixel => {
                this.dm.setData(
                    pixels[pixel].idx,
                    pixels[pixel].color,
                );
            });
        }
    }

    render() {
        return (
            <div style={this.props.style} ref={this.containerRef}>
                <canvas ref={this.canvasRef} className="pixelCanvas" />
                <PixelGrid/>
            </div>
        );
    }
}

export default PixelCanvas;
