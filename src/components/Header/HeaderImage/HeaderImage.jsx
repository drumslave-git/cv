import React, {Component} from 'react';
import Color from 'color';
import Draggable from 'react-draggable';
import style from './HeaderImage.less';
import DrawingMachine from '../../../helpers/DrawingMachine';
import {randFloat, arrayMove} from '../../../helpers/general';
import {getWindowData} from '../../../data/objects/objects';
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/dist/rc-color-picker.min.css'

class HeaderImage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sunPosition: {
                x: 0,
                y: 0
            },
            layers: this.getLayers(),
            layersOrder: this.getLayersOrder(),
            hiddenLayers: this.getHiddenLayers(),
            canvasColor: '#fff',
            brashSize: 1,
            color: 'black',
            colorPickerActive: false,
            canvasScale: 1,
            canvasTranslate: [0,0],
            overlays: this.getOverlays(),
            editOverlays: false,
            overlayToEdit: null,
        };
        this.state['currentLayer'] = Object.keys(this.state.layers)[0];
        if(Object.keys(this.state.layers).length !== this.state.layersOrder.length){
            Object.keys(this.state.layers).forEach(layerId => {
                if(!this.state.layersOrder.includes(layerId)){
                    this.state.layersOrder.push(layerId);
                }
            })
        }

        this.saveLayers();
        this.saveLayersOrder();

        this.containerRef = React.createRef();

        this.dm = null;
        this.canvasElRef = null;
        this.targetRef = React.createRef();
        this.canvasRef = (ref) => {
            this.canvasElRef = ref;
            if(ref) {
                const ctx = ref.getContext('2d');
                this.dm = new DrawingMachine(ctx);
            }
        };
        this.pixels = this.getPixels();
        this.mouseButton = 0;
        this.mouseMoveStart = [0,0];
        this.canvasTranslate = [0, 0];
        this.draggablePositions = this.getDraggablePositions();
    }

    componentDidMount() {
        this.draw();
        this.canvasElRef.addEventListener('mousedown', this.startDraw);
        this.canvasElRef.addEventListener('mouseup', this.stopDraw);
        this.canvasElRef.addEventListener('mousemove', this.drawTarget);
        this.canvasElRef.addEventListener('wheel', this.changeCanvasScale);
        this.canvasElRef.addEventListener('contextmenu', (e) => e.preventDefault());
    }

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

    drawTarget = (e) => {
        const {pageX, pageY} = e;
        // console.log('drawTarget', pageX, pageY);
        this.targetRef.current.style.left = `${Math.round((pageX - this.dm.pixelSize) / this.dm.pixelSize) * this.dm.pixelSize}px`
        this.targetRef.current.style.top = `${Math.round((pageY - this.dm.pixelSize) / this.dm.pixelSize) * this.dm.pixelSize}px`
    };

    drawPixel = (e) => {
        const {pageX, pageY} = e;
        // console.log('drawPixel', pageX, pageY);
        const box = this.canvasElRef.getBoundingClientRect();
        const x = Math.round(((pageX - box.x) - this.dm.pixelSize) / this.dm.pixelSize) * this.dm.pixelSize;
        const y = Math.round(((pageY - box.y) -this.dm.pixelSize) / this.dm.pixelSize) * this.dm.pixelSize;
        this.pixels[this.state.currentLayer] = this.pixels[this.state.currentLayer] || {};
        if(!this.state.colorPickerActive) {
            switch (this.mouseButton) {
                case 0:
                    for(let i = 0; i < this.state.brashSize; i++) {
                        for(let j = 0; j < this.state.brashSize; j++) {
                            let virtualDraw = false;
                            const pixelX = x + i;
                            const pixelY = y + j;
                            const curLayerOrder = this.state.layersOrder.indexOf(this.state.currentLayer);
                            if(curLayerOrder !== 0){
                                for(let o = 0; o < curLayerOrder; o++) {
                                    const layerId = this.state.layersOrder[o];
                                    if (!this.state.hiddenLayers.includes(layerId)){
                                        if (this.pixels[layerId] && this.pixels[layerId][`${pixelX},${pixelY}`]) {
                                            virtualDraw = true;
                                            break;
                                        }
                                    }
                                }
                            }
                            if(!virtualDraw) {
                                this.dm.drawPixel(
                                    this.state.color,
                                    pixelX,
                                    pixelY
                                );
                            }
                            this.pixels[this.state.currentLayer][`${pixelX},${pixelY}`] = {x: pixelX, y: pixelY, color: this.state.color};
                        }
                    }
                    this.savePixels();
                    break;
                case 1:
                    this.moveCanvas(e);
                    break;
                case 2:
                    for (let i = 0; i < this.state.brashSize; i++) {
                        for (let j = 0; j < this.state.brashSize; j++) {
                            const pixelX = x + i;
                            const pixelY = y + j;
                            if (this.pixels[this.state.currentLayer][`${pixelX},${pixelY}`]) {
                                this.dm.removePixel(
                                    pixelX,
                                    pixelY
                                );
                                this.pixels[this.state.currentLayer][`${pixelX},${pixelY}`] = null;
                            }
                        }
                    }
                    this.savePixels();
            }
        }else{
            if(this.pixels[this.state.currentLayer][`${x},${y}`]){
                this.setState({
                    color: this.pixels[this.state.currentLayer][`${x},${y}`].color,
                    colorPickerActive: false
                })
            }else{
                this.setState({
                    color: this.state.canvasColor,
                    colorPickerActive: false
                })
            }
        }
    };

    getDraggablePosition = (id) => {
        if(this.draggablePositions[id]){
            return this.draggablePositions[id];
        }
        return {x: 0, y: 0};
    };

    getDraggablePositions = () => {
        const draggablePositions = localStorage.getItem('draggablePositions');
        return draggablePositions ? JSON.parse(draggablePositions) : {};
    };

    getPixels = () => {
        const pixels = localStorage.getItem('pixels');
        return pixels ? JSON.parse(pixels) : {};
    };

    getLayers = () => {
        const layers = localStorage.getItem('layers');
        return layers ? JSON.parse(layers) : {[Date.now().toString()]: 'base'};
    };

    getLayersOrder = () => {
        const layers = localStorage.getItem('layersOrder');
        return layers ? JSON.parse(layers) : [];
    };

    getHiddenLayers = () => {
        const layers = localStorage.getItem('hiddenLayers');
        return layers ? JSON.parse(layers) : [];
    };

    getOverlays = () => {
        const layers = localStorage.getItem('overlays');
        return layers ? JSON.parse(layers) : [];
    };

    saveDraggablePosition(id, x, y){
        this.draggablePositions[id] = {x, y};
        this.saveDraggablePositions();
    }

    saveDraggablePositions = () => {
        localStorage.setItem('draggablePositions', JSON.stringify(this.draggablePositions))
    };

    savePixels = () => {
        const filtered = {};
        Object.keys(this.pixels).forEach(layer => {
            if(this.pixels[layer]){
                filtered[layer] = filtered[layer] || {};

                Object.keys(this.pixels[layer]).forEach(pixel => {
                    if(this.pixels[layer][pixel]) {
                        filtered[layer][pixel] = this.pixels[layer][pixel];
                    }
                })
            }
        });
        localStorage.setItem('pixels', JSON.stringify(filtered))
    };

    saveLayers = () => {
        const filtered = {};
        Object.keys(this.state.layers).forEach(layerId => {
            if(this.state.layers[layerId]){
                filtered[layerId] = this.state.layers[layerId];
            }
        });
        localStorage.setItem('layers', JSON.stringify(filtered))
    };

    saveHiddenLayers = () => {
        localStorage.setItem('hiddenLayers', JSON.stringify(this.state.hiddenLayers))
    };

    saveLayersOrder = () => {
        localStorage.setItem('layersOrder', JSON.stringify(this.state.layersOrder))
    };

    saveOverlays = () => {
        localStorage.setItem('overlays', JSON.stringify(this.state.overlays))
    };

    componentDidUpdate() {
        this.draw();
    }

    draw() {
            if(this.dm && this.containerRef && this.canvasElRef){
                this.canvasElRef.width = this.containerRef.current.clientWidth;
                this.canvasElRef.height = this.containerRef.current.clientHeight;
                if(Object.keys(this.pixels).length){
                    Array.from(this.state.layersOrder).reverse().map(layerId => {
                        const layerPixels = this.pixels[layerId];
                        if(layerPixels && !this.state.hiddenLayers.includes(layerId)){
                            Object.keys(layerPixels).filter(pixel => layerPixels[pixel] !== null).forEach(pixel => {
                                this.dm.drawPixel(
                                    layerPixels[pixel].color,
                                    layerPixels[pixel].x,
                                    layerPixels[pixel].y
                                );
                            });
                        }
                    });
                }
                // const xSUN = this.state.sunPosition.x;
                // // const xBreacks = Math.round(this.containerRef.current.clientWidth / this.dm.pixelSize);
                // const yBreacks = Math.round(this.containerRef.current.clientHeight / this.dm.pixelSize);
                // const xBreacks = 30;
                // this.dm.drawSun(xSUN, 0);
                // const baseColor = Color('#d2be9b');
                // // const baseColor = Color('rgba(255,255,0,0.)');
                // for(let i = 0; i < xBreacks; i += 10) {
                //     for(let j = 0; j < yBreacks; j += 5) {
                //         console.count('break');
                //         // console.log(i, j);
                //         this.dm.drawRect('black', i, j, 10, 5, {
                //             colorVariety: 0.2,
                //             shadow: true
                //         });
                //         this.dm.drawRect(baseColor.rotate(randFloat(0, 10)).hsl().string(), i + 1, j + 1, 9, 4, {
                //             colorVariety: 0.2,
                //             shadow: true
                //         });
                //
                //     }
                // }
                // getWindowData(60, 10, 22, 30, 2, '#895641').forEach(obj => {
                //     this.dm.drawRect(obj.color, obj.x, obj.y, obj.w, obj.h, obj.config);
                // });
                // getWindowData(2, 2, 9, 14, 1, 'white', true).forEach(obj => {
                //     this.dm.drawRect(obj.color, obj.x, obj.y, obj.w, obj.h, obj.config);
                // });
            }
    }

    editLayer = (id = null) => {
        const layersOrder = Array.from(this.state.layersOrder);
        let layerId = id;
        let name = '';
        if(layerId === null){
            layerId =  Date.now().toString();
            layersOrder.unshift(layerId);
        }else{
            name = this.state.layers[layerId];
        }
        name = prompt("Please enter new name", name);
        if(name !== null && name.trim() !== '') {
            this.setState({
                layers: {
                    ...this.state.layers,
                    [layerId]: name
                },
                layersOrder,
                currentLayer: layerId
            }, () => {
                this.saveLayers();
                this.saveLayersOrder();
            })
        }
    };

    removeLayer = (id) => {
        const layers = {};
        const pixels = {};
        let nextId = null;
        Object.keys(this.state.layers).forEach(layerId => {
            if(layerId.toString() !== id.toString()){
                layers[layerId] = this.state.layers[layerId];
                pixels[layerId] = this.pixels[layerId];
                if(nextId === null) {
                    nextId = layerId;
                }
            }
        });
        const hiddenLayers = Array.from(this.state.hiddenLayers);
        if(hiddenLayers.includes(id)){
            hiddenLayers.splice(hiddenLayers.indexOf(id), 1);
        }
        const layersOrder = Array.from(this.state.layersOrder);
        if(layersOrder.includes(id)){
            layersOrder.splice(layersOrder.indexOf(id), 1);
        }
        this.pixels = pixels;
        this.savePixels();
        this.setState({
            layers,
            hiddenLayers,
            layersOrder,
            currentLayer: nextId
        }, () => {
            this.saveLayers();
            this.saveLayersOrder();
            this.saveHiddenLayers();
        })
    };

    layerOrderChange = (id, dir) => {
        const layersOrder = Array.from(this.state.layersOrder);
        const curIdx = layersOrder.indexOf(id);
        if((curIdx > 0 || dir > 0) && (curIdx < layersOrder.length || dir < 0)){
            arrayMove(layersOrder, curIdx, curIdx + dir);
            this.setState({
                layersOrder
            }, this.saveLayersOrder);
        }
    };

    addOverlay = () => {
        const url = prompt('Specify URL for overlay');
        if(url &&  url.trim() !== ''){
            const overlays = Array.from(this.state.overlays);
            overlays.unshift({
                background: url.trim(),
                opacity: 0.5,
                width: 100,
                height: 100,
                left: 0,
                top: 0,
            });
            this.setState({
                overlays
            }, () => {
                this.saveOverlays();
            })
        }
    };

    removeOverlay = (idx) => {
        const overlays = Array.from(this.state.overlays);
        overlays.splice(idx, 1);
        this.setState({
            overlays,
            overlayToEdit: null,
        }, this.saveOverlays);
    };

    editOverlayDim = (dim, idx, size) => {
        const overlays = Array.from(this.state.overlays);
        overlays[idx][dim] = size;
        this.setState({
            overlays
        }, this.saveOverlays);
    };

    render() {
        const currentLayerIsHidden = this.state.hiddenLayers.includes(this.state.currentLayer);
        return (
            <React.Fragment>
                <div className={style.headerImage} ref={this.containerRef} >
                    {this.state.overlays.map((overlay, idx) => {
                        return (
                            <Draggable
                                handle={
                                    this.state.editOverlays ? `.${style.overlay}` : ''
                                }
                                key={idx}
                                defaultPosition={this.getDraggablePosition(`overlay_${idx}`)}
                                onDrag={(e, data) => this.saveDraggablePosition(`overlay_${idx}`, data.x, data.y)}
                            >
                                <div
                                    className={`${style.overlayWrapper} ${ this.state.editOverlays ? `${style.overlayEditMode}` : ''}`}
                                    style={{
                                        left: `${overlay.left}px`,
                                        top: `${overlay.top}px`,
                                    }}
                                >
                                    <div
                                        className={style.overlay}
                                        style={{
                                            backgroundImage: `url('${overlay.background}')`,
                                            width: `${overlay.width}px`,
                                            height: `${overlay.height}px`,
                                            opacity: overlay.opacity
                                        }}
                                    />
                                    <div>
                                        <button onClick={() => {
                                            this.setState({
                                                overlayToEdit: idx
                                            })
                                        }}>edit</button>
                                        <button onClick={() => this.removeOverlay(idx)}>remove</button>
                                    </div>
                                </div>
                            </Draggable>
                        );
                    })}
                    <canvas
                        className={style.canvas}
                        ref={this.canvasRef}
                        style={{
                            background: this.state.canvasColor,
                            transform: `scale(${this.state.canvasScale}) translate(${this.state.canvasTranslate[0] / this.state.canvasScale}px, ${this.state.canvasTranslate[1] / this.state.canvasScale}px)`
                        }}
                    />
                    <div className={style.target} ref={this.targetRef}/>
                </div>
                <Draggable
                    defaultPosition={this.getDraggablePosition('toolbar')}
                    onDrag={(e, data) => this.saveDraggablePosition('toolbar', data.x, data.y)}
                    handle={`.${style.toolbarTitle}`}
                >
                    <div className={style.toolbar}>
                        <div className={style.toolbarTitle}>
                            Tools
                        </div>
                        <div>
                            <ColorPicker
                                color={this.state.color}
                                onChange={({color}) => this.setState({
                                    color
                                })}
                                className={style.colorPicker}
                            />
                            <button onClick={() => {
                                this.setState({
                                    colorPickerActive: !this.state.colorPickerActive
                                })
                            }}>
                                {!this.state.colorPickerActive && 'P'}
                                {this.state.colorPickerActive && 'X'}
                            </button>
                            <ColorPicker
                                color={this.state.canvasColor}
                                onChange={({color}) => this.setState({
                                    canvasColor: color
                                })}
                                className={style.colorPicker}
                            />
                            <input
                                type="number"
                                value={this.state.brashSize}
                                className={style.brashSize}
                                onChange={e => {
                                    const size = Number(e.target.value);
                                    if(!isNaN(size)) {
                                        this.setState({
                                            brashSize: size
                                        })
                                    }else{
                                        this.setState({
                                            brashSize: 1
                                        })
                                    }
                                }}
                            />
                        </div>
                        <div>
                            <select
                                name="layers"
                                id="layers"
                                className={style.layers}
                                size={5}
                                value={this.state.currentLayer}
                                onChange={e => this.setState({
                                    currentLayer: e.target.value
                                })}
                            >
                                {this.state.layersOrder.map(layerId => {
                                    const layerName = this.state.layers[layerId];
                                    const layerIsHidden = this.state.hiddenLayers.includes(layerId);
                                    return <option key={layerId} value={layerId}>
                                        {layerIsHidden && '(-) '}
                                        {layerName}
                                    </option>
                                })}
                            </select>
                            <button onClick={() => this.editLayer()}>Add</button>
                            <button onClick={() => this.editLayer(this.state.currentLayer)}>Edit</button>
                            {!currentLayerIsHidden && (
                                <button onClick={() => {
                                    const hiddenLayers = Array.from(this.state.hiddenLayers);
                                    hiddenLayers.push(this.state.currentLayer);
                                    this.setState({hiddenLayers}, this.saveHiddenLayers);
                                }}>Hide</button>
                            )}
                            {currentLayerIsHidden && (
                                <button onClick={() => {
                                    const hiddenLayers = Array.from(this.state.hiddenLayers);
                                    hiddenLayers.splice(hiddenLayers.indexOf(this.state.currentLayer), 1);
                                    this.setState({hiddenLayers}, this.saveHiddenLayers);
                                }}>Show</button>
                            )}
                            {Object.keys(this.state.layers).length > 1 && (
                                <React.Fragment>
                                    <button onClick={() => this.removeLayer(this.state.currentLayer)}>Remove</button>
                                    <button onClick={() => this.layerOrderChange(this.state.currentLayer, -1)}>Up</button>
                                    <button onClick={() => this.layerOrderChange(this.state.currentLayer, 1)}>Down</button>
                                </React.Fragment>
                            )}
                            <button onClick={this.addOverlay}>Add overlay</button>
                            {this.state.editOverlays && (
                                <button onClick={() => {
                                    this.setState({
                                        editOverlays: false
                                    })
                                }}>X</button>
                            )}
                            {!this.state.editOverlays && (
                                <button onClick={() => {
                                    this.setState({
                                        editOverlays: true
                                    })
                                }}>Edit overlays</button>
                            )}
                        </div>
                    </div>
                </Draggable>
                <div>
                    <div>
                        {this.state.overlayToEdit !== null && (
                            <Draggable
                                handle={'.moveOverlayConfig'}
                                defaultPosition={this.getDraggablePosition('overlayConfig')}
                                onDrag={(e, data) => this.saveDraggablePosition('overlayConfig', data.x, data.y)}
                            >
                                <div className={style.overlayConfig}>
                                    <div
                                        className={style.overlayThumb}
                                        style={{
                                            backgroundImage: `url('${this.state.overlays[this.state.overlayToEdit].background}')`
                                        }}
                                    />
                                    <div>
                                        <label>
                                            <button className="moveOverlayConfig">Move</button>
                                        </label>
                                        <label htmlFor={`overlayWidth`}>
                                            bg
                                            <input
                                                id={`overlayWidth`}
                                                type="text"
                                                value={this.state.overlays[this.state.overlayToEdit].background}
                                                onChange={(e) => this.editOverlayDim('background', this.state.overlayToEdit, e.target.value)}
                                            />
                                        </label>
                                        <label htmlFor={`overlayWidth`}>
                                            width
                                            <input
                                                id={`overlayWidth`}
                                                type="number"
                                                value={this.state.overlays[this.state.overlayToEdit].width}
                                                onChange={(e) => this.editOverlayDim('width', this.state.overlayToEdit, e.target.value)}
                                            />
                                        </label>
                                        <label htmlFor={`overlayHeight`}>
                                            height
                                            <input
                                                id={`overlayHeight`}
                                                type="number"
                                                value={this.state.overlays[this.state.overlayToEdit].height}
                                                onChange={(e) => this.editOverlayDim('height', this.state.overlayToEdit, e.target.value)}
                                            />
                                        </label>
                                        <label htmlFor={`overlayOpacity`}>
                                            opacity
                                            <input
                                                id={`overlayOpacity`}
                                                type="number"
                                                value={this.state.overlays[this.state.overlayToEdit].opacity}
                                                onChange={(e) => this.editOverlayDim('opacity', this.state.overlayToEdit, e.target.value)}
                                            />
                                        </label>
                                        <label>
                                            <button onClick={() => {
                                                this.setState({
                                                    overlayToEdit: null
                                                })
                                            }}>Done</button>
                                        </label>
                                    </div>
                                </div>
                            </Draggable>
                        )}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default HeaderImage;
