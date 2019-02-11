import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import DrawingMachine from '../../../helpers/DrawingMachine';

class PixelGrid extends PureComponent {
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
    }

    componentDidMount() {
        this.draw();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.draw();
    }

    draw() {
        if(this.dm && this.containerRef && this.canvasElRef){
            this.canvasElRef.width = this.containerRef.current.clientWidth;
            this.canvasElRef.height = this.containerRef.current.clientHeight;
            this.dm.setGridDimension();

            this.dm.drawGrid();
            this.dm.drawData(true);
        }
    }

    render() {
        return (
            <div ref={this.containerRef} style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                left: 0,
                top: 0,
                pointerEvents: 'none'
            }}>
                <canvas ref={this.canvasRef} className="pixelGridCanvas"/>
            </div>
        );
    }
}

PixelGrid.propTypes = {};

export default PixelGrid;
