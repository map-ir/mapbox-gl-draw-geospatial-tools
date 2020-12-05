[![NPM](https://img.shields.io/npm/v/mapbox-gl-draw-geospatial-tools.svg)](https://www.npmjs.com/package/mapbox-gl-draw-geospatial-tools)
![Develop](https://github.com/map-ir/mapbox-gl-draw-geospatial-tools/workflows/Develop/badge.svg)
![Release](https://github.com/map-ir/mapbox-gl-draw-geospatial-tools/workflows/Release/badge.svg)

# Mapbox GL Draw Geospatial Tools

Advanced tools for geospatial edit and analysis based on [MapboxGL-Draw](https://github.com/mapbox/mapbox-gl-draw)

## [DEMO](https://map-ir.github.io/mapbox-gl-draw-additional-tools/)

![A Gif showing demo usage](demo/public/demo.gif)

## Install

```bash
npm install mapbox-gl-draw-geospatial-tools
```

or use CDN:

```html
<script src="https://unpkg.com/mapbox-gl-draw-geospatial-tools"></script>
```

## Usage

```js
import mapboxGl from 'mapbox-gl';
import MapboxDrawPro from 'mapbox-gl-draw-geospatial-tools';

const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-91.874, 42.76], // starting position
    zoom: 12, // starting zoom
});

const draw = new MapboxDrawPro(option);
```

# `MapboxDrawPro` supported all options and methods of [MapboxGL-Draw](https://github.com/mapbox/mapbox-gl-draw). See [API.md](https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/API.md) for complete reference.

Also, options can be these:

```js
{
    union: true, // Default is true. If set to false, the button does not appear in toolbox
    copy: true, // Default is true. If set to false, the button does not appear in toolbox
    buffer: true, // Default is true. If set to false, the button does not appear in toolbox
    bufferSize: 0.5, // Default is 500
    bufferUnit: 'kilometers', //Default is kilometers. It can be miles, degrees or kilometers
    bufferSteps: 64, // Default is 64
    length: true, // Default is true. If set to false, the button does not appear in toolbox
    lengthUnit: 'kilometers', //Default is kilometers. It can be miles, degrees, radians or kilometers
    showLength: true, // Default is true. If set to false, the value does not appear on feature
    area: true, // Default is true. If set to false, the button does not appear in toolbox
    showArea: true, // Default is true. If set to false, the value does not appear on feature
}
```

## [Example](https://github.com/map-ir/mapbox-gl-draw-geospatial-tools/blob/main/demo/src/App.js)

## License

MIT © [map-ir](LICENSE)
