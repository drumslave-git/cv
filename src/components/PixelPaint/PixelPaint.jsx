import React, {Component} from 'react';
import Color from 'color';
import Draggable from 'react-draggable';
import style from './PixelPaint.less';
import DrawingMachine from '../../helpers/DrawingMachine';
import {randFloat, arrayMove} from '../../helpers/general';
import {getWindowData} from '../../data/objects/objects';
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/dist/rc-color-picker.min.css'
import PixelCanvas from './PixelCanvas';

class PixelPaint extends Component {
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

        this.pixels = this.getPixels();
        this.state['pixels'] = this.getVisiblePixels(true);
        this.draggablePositions = this.getDraggablePositions();
    }

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

    getColor = () => {
        return this.state.color;
    };

    saveDraggablePosition(id, x, y){
        this.draggablePositions[id] = {x, y};
        this.saveDraggablePositions();
    }

    saveDraggablePositions = () => {
        localStorage.setItem('draggablePositions', JSON.stringify(this.draggablePositions))
    };

    savePixel = (pixel) => {
        const { currentLayer } = this.state;
        this.pixels[currentLayer] = this.pixels[currentLayer] || {};
        this.pixels[currentLayer][pixel.idx] = pixel;
        this.savePixels();
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

    canvasStyle = {
        width: '100%',
        height: '100%',
        position: 'absolute'
    };

    getVisiblePixels(get = false){
        const { layersOrder = [], hiddenLayers = [] } = this.state;
        let pixels = {};
        layersOrder.forEach(layerId => {
            if(!hiddenLayers.includes(layerId)) {
                if(this.pixels[layerId]){
                    pixels = {...pixels, ...this.pixels[layerId]};
                }
            }
        });

        if(!get){
            this.setState({pixels});
        }

        return pixels;
    }

    toggleLayerVisibility(show){
        const hiddenLayers = Array.from(this.state.hiddenLayers);
        if(show){
            hiddenLayers.splice(hiddenLayers.indexOf(this.state.currentLayer), 1);
        }else{
            hiddenLayers.push(this.state.currentLayer);
        }
        this.setState({hiddenLayers}, () => {
                this.saveHiddenLayers();
                this.getVisiblePixels();
        });
    }

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
                    <PixelCanvas
                        style={this.canvasStyle}
                        pixels={this.state.pixels}
                        getColor={this.getColor}
                        savePixel={this.savePixel}
                    />
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
                                <button onClick={() => this.toggleLayerVisibility()}>Hide</button>
                            )}
                            {currentLayerIsHidden && (
                                <button onClick={() => this.toggleLayerVisibility(true)}>Show</button>
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

export default PixelPaint;
