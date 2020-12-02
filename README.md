[![NPM](https://img.shields.io/npm/v/mapbox-gl-draw-geospatial-tools.svg)](https://www.npmjs.com/package/mapbox-gl-draw-geospatial-tools)
![Develop](https://github.com/reyhanemasumi/mapbox-gl-draw-geospatial-tools/workflows/Develop/badge.svg)
![Release](https://github.com/reyhanemasumi/mapbox-gl-draw-geospatial-tools/workflows/Release/badge.svg)

# Mapbox GL Draw Geospatial Tools

Advanced tools for geospatial edit and analysis based on Mapbox Gl Draw

## [DEMO](https://reyhanemasumi.github.io/mapbox-gl-draw-additional-tools/)

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
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import geospatialTools from 'mapbox-gl-draw-geospatial-tools';

const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-91.874, 42.76], // starting position
    zoom: 12, // starting zoom
});

const draw = new MapboxDraw({
    modes: {
        ...MapboxDraw.modes,
    },
});
```

## [Example](https://github.com/ReyhaneMasumi/mapbox-gl-draw-geospatial-tools/blob/main/demo/src/App.js)
