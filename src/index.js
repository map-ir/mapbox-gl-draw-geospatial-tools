import MapboxDraw from '@mapbox/mapbox-gl-draw';
import defaultDrawStyle from '@mapbox/mapbox-gl-draw/src/lib/theme';

import unionBy from 'lodash.unionby';

import { SnapPolygonMode, SnapPointMode, SnapLineMode, SnapModeDrawStyles } from 'mapbox-gl-draw-snap-mode';
import mapboxGlDrawPinningMode from 'mapbox-gl-draw-pinning-mode';
import * as mapboxGlDrawPassingMode from 'mapbox-gl-draw-passing-mode';
import { SRMode, SRCenter, SRStyle } from 'mapbox-gl-draw-scale-rotate-mode';
import CutPolygonMode from 'mapbox-gl-draw-cut-polygon-mode';
import SplitPolygonMode, { drawStyles as splitPolygonDrawStyles } from 'mapbox-gl-draw-split-polygon-mode';
import SplitLineMode from 'mapbox-gl-draw-split-line-mode';
import FreehandMode from 'mapbox-gl-draw-freehand-mode';
import DrawRectangle, { DrawStyles as RectRestrictStyles } from 'mapbox-gl-draw-rectangle-restrict-area';
import DrawRectangleAssisted from '@geostarters/mapbox-gl-draw-rectangle-assisted-mode';
import { additionalTools, measurement, addToolStyle } from 'mapbox-gl-draw-additional-tools';

// import MapboxCircle from 'mapbox-gl-circle';
const MapboxCircle = require('mapbox-gl-circle');
require('./index.css');
require('@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css');

class SnapOptionsToolbar {
    constructor(opt) {
        let ctrl = this;
        ctrl.checkboxes = opt.checkboxes || [];
        ctrl.onRemoveOrig = opt.draw.onRemove;
    }
    onAdd(map) {
        let ctrl = this;
        ctrl.map = map;
        ctrl._container = document.createElement('div');
        ctrl._container.className = 'mapboxgl-ctrl-group mapboxgl-ctrl';
        ctrl.elContainer = ctrl._container;
        ctrl.checkboxes.forEach((b) => {
            ctrl.addCheckbox(b);
        });
        return ctrl._container;
    }
    onRemove(map) {
        ctrl.checkboxes.forEach((b) => {
            ctrl.removeButton(b);
        });
        ctrl.onRemoveOrig(map);
    }
    addCheckbox(opt) {
        let ctrl = this;
        var elCheckbox = document.createElement('input');
        elCheckbox.setAttribute('type', 'checkbox');
        elCheckbox.setAttribute('title', opt.title);
        elCheckbox.checked = opt.initialState === 'checked';
        elCheckbox.className = 'mapbox-gl-draw_ctrl-draw-btn';
        if (opt.classes instanceof Array) {
            opt.classes.forEach((c) => {
                elCheckbox.classList.add(c);
            });
        }
        elCheckbox.addEventListener(opt.on, opt.action);
        ctrl.elContainer.appendChild(elCheckbox);
        opt.elCheckbox = elCheckbox;
    }
    removeButton(opt) {
        opt.elCheckbox.removeEventListener(opt.on, opt.action);
        opt.elCheckbox.remove();
    }
}

export default class MapboxDrawPro extends MapboxDraw {
    constructor(options) {
        options = options || {};
        const { modes, styles, otherOtions } = options;

        const customModes = {
            // ...MapboxDraw.modes,
            ...SplitPolygonMode(MapboxDraw.modes),
            draw_point: SnapPointMode,
            draw_polygon: SnapPolygonMode,
            draw_line_string: SnapLineMode,
            pinning_mode: mapboxGlDrawPinningMode,
            passing_mode_point: mapboxGlDrawPassingMode.passing_draw_point,
            passing_mode_line_string: mapboxGlDrawPassingMode.passing_draw_line_string,
            passing_mode_polygon: mapboxGlDrawPassingMode.passing_draw_polygon,
            scaleRotateMode: SRMode,
            cutPolygonMode: CutPolygonMode,
            splitLineMode: SplitLineMode,
            freehandMode: FreehandMode,
            draw_rectangle: DrawRectangle,
            draw_rectangle_assisted: DrawRectangleAssisted,
        };

        const customOptions = {
            bufferSize: 0.5,
            bufferUnit: 'kilometers',
            bufferSteps: 64,
            snap: false,
            // snapOptions: {
            //   snapPx: 15,
            //   snapToMidPoints: true,
            // },
            guides: false,
            userProperties: true,
        };

        const _modes = { ...customModes, ...modes };
        const __styles = [...splitPolygonDrawStyles(defaultDrawStyle)];
        const _styles = unionBy(styles, RectRestrictStyles, SnapModeDrawStyles, SRStyle, addToolStyle, 'id');
        const _options = { modes: _modes, styles: _styles, ...customOptions, ...otherOtions };

        super(_options);

        this.buttons = [
            {
                on: 'click',
                action: (map) => {
                    this.map.getCanvas().style.cursor = 'pointer';
                    this.map.once('click', (e) => {
                        this.map.getCanvas().style.cursor = '';
                        var myCircle = new MapboxCircle(e.lngLat, 250, {
                            editable: false,
                            fillColor: '#3bb2d0',
                            fillOpacity: 0.1,
                            strokeColor: '#3bb2d0',
                            strokeWeight: 2,
                        }).addTo(this.map);
                        myCircle.on('click', (mapMouseEvent) => {
                            myCircle.remove();
                            if (!myCircle.options.editable) {
                                myCircle.options.editable = true;
                                myCircle.options.fillColor = '#fbb03b';
                                myCircle.options.strokeColor = '#fbb03b';
                            } else {
                                myCircle.options.editable = false;
                                myCircle.options.fillColor = '#3bb2d0';
                                myCircle.options.strokeColor = '#3bb2d0';
                            }
                            myCircle._updateCircle(); // <-- this re-initializes internal values of the circle
                            myCircle.addTo(this.map);
                        });
                        myCircle.on('centerchanged', (circleObj) => {
                            myCircle.remove();
                            myCircle.options.editable = false;
                            myCircle.options.fillColor = '#3bb2d0';
                            myCircle.options.strokeColor = '#3bb2d0';
                            myCircle._updateCircle(); // <-- this re-initializes internal values of the circle
                            myCircle.addTo(this.map);
                        });
                        myCircle.on('radiuschanged', (circleObj) => {
                            myCircle.remove();
                            myCircle.options.editable = false;
                            myCircle.options.fillColor = '#3bb2d0';
                            myCircle.options.strokeColor = '#3bb2d0';
                            myCircle._updateCircle(); // <-- this re-initializes internal values of the circle
                            myCircle.addTo(this.map);
                        });
                    });
                },
                classes: ['draw-circle'],
                title: 'Draw Circle tool',
            },
            {
                on: 'click',
                action: () => {
                    try {
                        draw.changeMode('freehandMode');
                    } catch (err) {
                        console.error(err);
                    }
                },
                classes: ['free-hand'],
                title: 'Free-Hand Draw Mode tool',
            },
            {
                on: 'click',
                action: () => {
                    try {
                        draw.changeMode('draw_rectangle', {
                            areaLimit: parseInt(prompt('Max Area? (empty for no restriction)')), // 5 * 1_000_000, // 5 km2, optional
                            // escapeKeyStopsDrawing: true, // default true
                            // allowCreateExceeded: false, // default false
                            // exceedCallsOnEachMove: false, // default false
                            // exceedCallback: (area) => console.log('exceeded!', area), // optional
                            // areaChangedCallback: (area) => console.log('updated', area), // optional
                        });
                    } catch (err) {
                        console.error(err);
                    }
                },
                classes: ['draw-rectangle'],
                title: 'Rectangle Draw Mode tool',
            },
            {
                on: 'click',
                action: () => {
                    try {
                        draw.changeMode('draw_rectangle_assisted');
                    } catch (err) {
                        console.error(err);
                    }
                },
                classes: ['draw-rectangle-assisted'],
                title: 'Assisted Rectangle Draw Mode tool',
            },
            {
                on: 'click',
                action: () => {
                    try {
                        draw.changeMode('splitLineMode', {
                            spliter: prompt('Which Mode? (point, line_string, polygon)'),
                        });
                    } catch (err) {
                        alert(err.message);
                        console.error(err);
                    }
                },
                classes: ['split-line'],
                title: 'Split Line Mode tool',
            },
            {
                on: 'click',
                action: () => {
                    try {
                        draw.changeMode('split_polygon');
                    } catch (err) {
                        alert(err.message);
                        console.error(err);
                    }
                },
                classes: ['split-polygon'],
                title: 'Split Polygon Mode tool',
            },
            {
                on: 'click',
                action: () => {
                    try {
                        draw.changeMode('cutPolygonMode');
                    } catch (err) {
                        alert(err.message);
                        console.error(err);
                    }
                },
                classes: ['cut-polygon'],
                title: 'Cut Polygon Mode tool',
            },
            {
                on: 'click',
                action: () => {
                    try {
                        draw.changeMode('scaleRotateMode', {
                            // required
                            canScale: true,
                            canRotate: true, // only rotation enabled
                            canTrash: false, // disable feature delete

                            rotatePivot: SRCenter.Center, // rotate around center
                            scaleCenter: SRCenter.Opposite, // scale around opposite vertex

                            singleRotationPoint: true, // only one rotation point
                            rotationPointRadius: 1.2, // offset rotation point

                            canSelectFeatures: true,
                        });
                    } catch (err) {
                        alert(err.message);
                        console.error(err);
                    }
                },
                classes: ['rotate-icon'],
                title: 'Scale and Rotate Mode tool',
            },
            {
                on: 'click',
                action: () => {
                    draw.changeMode('pinning_mode');
                },
                classes: ['pinning_mode'],
                title: 'Pinning Mode tool',
            },
            // {
            //     on: 'click',
            //     action: () => {
            //         draw.changeMode('passing_mode_point');
            //     },
            //     classes: ['passing_mode', 'point'],
            //     title: 'Passing-Point tool',
            // },
            // {
            //     on: 'click',
            //     action: () => {
            //         draw.changeMode('passing_mode_line_string', (info) => {
            //             console.log(info);
            //         });
            //     },
            //     classes: ['passing_mode', 'line'],
            //     title: 'Passing-LineString tool',
            // },
            // {
            //     on: 'click',
            //     action: () => {
            //         draw.changeMode('passing_mode_polygon');
            //     },
            //     classes: ['passing_mode', 'polygon'],
            //     title: 'Passing-Polygon tool',
            // },
        ];

        this.onAddOrig = this.onAdd;
        this.onRemoveOrig = this.onRemove;

        const addOtherControls = async (map, draw, placement) => {
            const snapOptionsBar = new SnapOptionsToolbar({
                draw,
                checkboxes: [
                    {
                        on: 'change',
                        action: (e) => {
                            draw.options.snap = e.target.checked;
                        },
                        classes: ['snap_mode', 'snap'],
                        title: 'Snap when Draw',
                        initialState: 'checked',
                    },
                    {
                        on: 'change',
                        action: (e) => {
                            draw.options.guides = e.target.checked;
                        },
                        classes: ['snap_mode', 'grid'],
                        title: 'Show Guides',
                    },
                ],
            });

            setTimeout(() => {
                map.addControl(additionalTools(draw), placement);
                map.addControl(snapOptionsBar, placement);
            }, 400);
        };

        this.onAdd = (map, placement) => {
            this.map = map;
            this.elContainer = this.onAddOrig(map, placement);

            this.buttons.forEach((b) => {
                this.addButton(b);
            });

            addOtherControls(map, this, placement);
            return this.elContainer;
        };

        this.onRemove = (map) => {
            this.buttons.forEach((b) => {
                this.removeButton(b);
            });
            this.onRemoveOrig(map);
        };

        this.addButton = (opt) => {
            var elButton = document.createElement('button');
            elButton.className = 'mapbox-gl-draw_ctrl-draw-btn';
            elButton.setAttribute('title', opt.title);
            if (opt.classes instanceof Array) {
                opt.classes.forEach((c) => {
                    elButton.classList.add(c);
                });
            }
            elButton.addEventListener(opt.on, opt.action);
            this.elContainer.appendChild(elButton);
            opt.elButton = elButton;
        };

        this.removeButton = (opt) => {
            opt.elButton.removeEventListener(opt.on, opt.action);
            opt.elButton.remove();
        };
    }
}
