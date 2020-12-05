import additionalTools from 'mapbox-gl-draw-additional-tools';
import './index.css';
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

class ExtendDrawBar {
    constructor(opt) {
        let ctrl = this;
        ctrl.draw = opt.draw;
        ctrl.buttons = opt.buttons || [];
        ctrl.onAddOrig = opt.draw.onAdd;
        ctrl.onRemoveOrig = opt.draw.onRemove;
    }
    onAdd(map) {
        let ctrl = this;
        ctrl.map = map;
        ctrl.elContainer = ctrl.onAddOrig(map);
        ctrl.buttons.forEach((b) => {
            ctrl.addButton(b);
        });
        return ctrl.elContainer;
    }
    onRemove(map) {
        ctrl.buttons.forEach((b) => {
            ctrl.removeButton(b);
        });
        ctrl.onRemoveOrig(map);
    }
    addButton(opt) {
        let ctrl = this;
        var elButton = document.createElement('button');
        elButton.className = 'mapbox-gl-draw_ctrl-draw-btn';
        elButton.setAttribute('title', opt.title);
        if (opt.classes instanceof Array) {
            opt.classes.forEach((c) => {
                elButton.classList.add(c);
            });
        }
        elButton.addEventListener(opt.on, opt.action);
        ctrl.elContainer.appendChild(elButton);
        opt.elButton = elButton;
    }
    removeButton(opt) {
        opt.elButton.removeEventListener(opt.on, opt.action);
        opt.elButton.remove();
    }
}

export default {
    addControl(map, draw, placement) {
        const snapOptionsBar = new SnapOptionsToolbar({
            draw: draw,
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

        const drawBar = new ExtendDrawBar({
            draw: draw,
            buttons: [
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
                },
                {
                    on: 'click',
                    action: () => {
                        try {
                            draw.changeMode('splitPolygonMode');
                        } catch (err) {
                            alert(err.message);
                            console.error(err);
                        }
                    },
                    classes: ['split-polygon'],
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
            ],
        });

        map.addControl(drawBar, placement);
        map.addControl(additionalTools(draw), placement);
        map.addControl(snapOptionsBar, placement);
    },

    // patchModes(MapboxDrawModes) {
    //     return {
    //             ...MapboxDraw.modes,
    //             draw_point: SnapPointMode,
    //             draw_polygon: SnapPolygonMode,
    //             draw_line_string: SnapLineMode,
    //             pinning_mode: mapboxGlDrawPinningMode,
    //             passing_mode_point: mapboxGlDrawPassingMode(MapboxDraw.modes.draw_point),
    //             passing_mode_line_string: mapboxGlDrawPassingMode(MapboxDraw.modes.draw_line_string),
    //             passing_mode_polygon: mapboxGlDrawPassingMode(MapboxDraw.modes.draw_polygon),
    //             scaleRotateMode: SRMode,
    //             cutPolygonMode: CutPolygonMode,
    //             splitPolygonMode: SplitPolygonMode,
    //             splitLineMode: SplitLineMode,
    //     }
    // }
};
