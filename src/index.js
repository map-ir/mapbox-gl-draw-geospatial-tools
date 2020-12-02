import { SnapPolygonMode, SnapPointMode, SnapLineMode, SnapModeDrawStyles } from 'mapbox-gl-draw-snap-mode';

import mapboxGlDrawPinningMode from 'mapbox-gl-draw-pinning-mode.js';

import mapboxGlDrawPassingMode from 'mapbox-gl-draw-passing-mode.js';

import { SRMode, SRCenter, SRStyle } from 'mapbox-gl-draw-scale-rotate-mode';

import mapboxGlDrawPassingMode from 'mapbox-gl-draw-passing-mode';

import mapboxGlDrawPassingMode from 'mapbox-gl-draw-passing-mode';

import mapboxGlDrawPassingMode from 'mapbox-gl-draw-passing-mode';

import additionalTools from 'mapbox-gl-draw-additional-tools';

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

class extendDrawBar {
    constructor(opt) {
        this.draw = opt.draw;
        this.onRemoveOrig = opt.draw.onRemove;
        const { union, copy, buffer } = this.draw.options;
        this.initialOptions = { union, copy, buffer };

        this.buttons = [
            {
                name: 'Union',
                callback: this.unionPolygons,
                title: `Union tool`,
                classes: ['mapbox-gl-draw_union', opt.classPrefix ? `${opt.classPrefix}-union` : null],
            },
            {
                name: 'Buffer',
                callback: this.bufferFeature,
                title: `Buffer tool`,
                classes: ['mapbox-gl-draw_buffer', opt.classPrefix ? `${opt.classPrefix}-buffer` : null],
            },
            {
                name: 'Copy',
                callback: this.copyFeature,
                title: `Copy tool`,
                classes: ['mapbox-gl-draw_copy', opt.classPrefix ? `${opt.classPrefix}-copy` : null],
            },
        ];
    }

    onAdd(map) {
        this.map = map;
        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl-group mapboxgl-ctrl';
        this.elContainer = this._container;
        this.buttons
            .filter((button) => this.initialOptions[button.name.toLowerCase()] !== false)
            .forEach((b) => {
                this.addButton(b);
            });
        return this._container;
    }
    onRemove(map) {
        this.buttons
            .filter((button) => this.initialOptions[button.name.toLowerCase()] !== false)
            .forEach((b) => {
                this.removeButton(b);
            });
        this.onRemoveOrig(map);
    }

    addButton(opt) {
        var elButton = document.createElement('button');
        elButton.className = 'mapbox-gl-draw_ctrl-draw-btn';
        elButton.setAttribute('title', opt.title);
        if (opt.classes instanceof Array) {
            opt.classes.forEach((c) => {
                elButton.classList.add(c);
            });
        }
        elButton.addEventListener('click', opt.callback.bind(this));
        this.elContainer.appendChild(elButton);
        opt.elButton = elButton;
    }

    removeButton(opt) {
        opt.elButton.removeEventListener('click', opt.action);
        opt.elButton.remove();
    }
}

export default (map, draw, placement) => {
    map.addControl(extendDrawBar, placement);
    map.addControl(additionalTools(draw, 'custom-prefix'), placement);
    map.addControl(SnapOptionsToolbar, placement);
};
