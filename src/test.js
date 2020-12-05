import MapboxDraw from '@mapbox/mapbox-gl-draw';
import defaultStyle from '@mapbox/mapbox-gl-draw/src/lib/theme';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import { SnapPolygonMode, SnapPointMode, SnapLineMode, SnapModeDrawStyles } from 'mapbox-gl-draw-snap-mode';
import mapboxGlDrawPinningMode from 'mapbox-gl-draw-pinning-mode';
import mapboxGlDrawPassingMode from 'mapbox-gl-draw-passing-mode';
import { SRMode, SRCenter, SRStyle } from 'mapbox-gl-draw-scale-rotate-mode';
import CutPolygonMode from 'mapbox-gl-draw-cut-polygon-mode';
import SplitPolygonMode from 'mapbox-gl-draw-split-polygon-mode';
import SplitLineMode from 'mapbox-gl-draw-split-line-mode';
import additionalTools, { measurement, addToolStyle } from 'mapbox-gl-draw-additional-tools';

class geospatialTool {
    constructor(opt) {
        this.draw = new MapboxDraw({
            modes: opt.modes || {
                ...MapboxDraw.modes,
                draw_point: SnapPointMode,
                draw_polygon: SnapPolygonMode,
                draw_line_string: SnapLineMode,
                pinning_mode: mapboxGlDrawPinningMode,
                passing_mode_point: mapboxGlDrawPassingMode(MapboxDraw.modes.draw_point),
                passing_mode_line_string: mapboxGlDrawPassingMode(MapboxDraw.modes.draw_line_string),
                passing_mode_polygon: mapboxGlDrawPassingMode(MapboxDraw.modes.draw_polygon),
                scaleRotateMode: SRMode,
                cutPolygonMode: CutPolygonMode,
                splitPolygonMode: SplitPolygonMode,
                splitLineMode: SplitLineMode,
            },
            styles: opt.styles || [...new Set([...defaultStyle, ...SnapModeDrawStyles, ...SRStyle, ...addToolStyle])],
            userProperties: opt.userProperties || true,
            union: opt.union || true,
            copy: opt.copy || true,
            buffer: opt.buffer || true,
            length: opt.length || true,
            area: opt.area || true,
            bufferSize: opt.bufferSize || 500,
            bufferUnit: opt.bufferUnit || 'kilometers',
            bufferSteps: opt.bufferSteps || 64,
            lengthUnit: opt.lengthUnit || 'kilometers',
            showLength: opt.showLength || true,
            showArea: opt.showArea || true,
        });
        this.buttons = opt.buttons || [];
        this.onAddOrig = this.draw.onAdd;
        this.onRemoveOrig = this.draw.onRemove;
    }
}

export default (map, option) => new geospatialTool({ map, option });
