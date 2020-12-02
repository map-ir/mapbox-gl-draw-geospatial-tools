import Union from '@turf/union';
import Buffer from '@turf/buffer';
import transformTranslate from '@turf/transform-translate';

require('./index.css');

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

    unionPolygons() {
        const selectedFeatures = this.draw.getSelected().features;
        if (!selectedFeatures.length) return;
        let unionPoly;
        try {
            unionPoly = Union(...this.draw.getSelected().features);
        } catch (err) {
            throw new Error(err);
        }
        if (unionPoly.geometry.type === 'GeometryCollection')
            throw new Error('Selected Features must have the same types!');
        let ids = selectedFeatures.map((i) => i.id);
        this.draw.delete(ids);
        unionPoly.id = ids.join('-');
        this.draw.add(unionPoly);
        this.draw.changeMode('simple_select', { featureIds: [unionPoly.id] });
    }

    bufferFeature() {
        const selectedFeatures = this.draw.getSelected().features;
        if (!selectedFeatures.length) return;
        const bufferOptions = {};
        bufferOptions.units = this.draw.options.bufferUnits || 'kilometers';
        bufferOptions.steps = this.draw.options.bufferSteps || '64';
        let ids = [];
        selectedFeatures.forEach((main) => {
            let buffered = Buffer(main, this.draw.options.bufferSize || 0.5, bufferOptions);
            buffered.id = `${main.id}_buffer_${Math.floor(Math.random() * Math.floor(1000))}`;
            ids.push(buffered.id);
            this.draw.add(buffered);
        });
        this.draw.changeMode('simple_select', { featureIds: ids });
    }

    copyFeature() {
        const selectedFeatures = this.draw.getSelected().features;
        if (!selectedFeatures.length) return;
        let ids = [];
        selectedFeatures.forEach((main) => {
            var translatedPoly = transformTranslate(main, 2, 35);
            translatedPoly.id = `${main.id}_copy_${Math.floor(Math.random() * Math.floor(1000))}`;
            ids.push(translatedPoly.id);
            this.draw.add(translatedPoly);
        });
        this.draw.changeMode('simple_select', { featureIds: ids });
    }
}

/*
options
------


{
    union: true,
    copy: true,
    buffer: true,
    bufferSize: 500,
    bufferUnit: 'kilometers',
    bufferSteps: 64,
}
*/

export default (draw, classPrefix) =>
    new extendDrawBar({
        draw,
        classPrefix,
    });
