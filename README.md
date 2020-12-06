[![NPM](https://img.shields.io/npm/v/@map.ir/mapbox-gl-draw-geospatial-tools.svg)](https://www.npmjs.com/package/@map.ir/mapbox-gl-draw-geospatial-tools)
![Develop](https://github.com/map-ir/mapbox-gl-draw-geospatial-tools/workflows/Develop/badge.svg)
![Release](https://github.com/map-ir/mapbox-gl-draw-geospatial-tools/workflows/Release/badge.svg)

# Mapbox GL Draw Geospatial Tools

Advanced tools for geospatial edit and analysis based on [MapboxGL-Draw](https://github.com/mapbox/mapbox-gl-draw).

Internally multiple Mapbox GL Draw plugins are used:

-   [Split LineString Mode](https://github.com/ReyhaneMasumi/mapbox-gl-draw-split-line-mode)
-   [Split Polygon Mode](https://github.com/ReyhaneMasumi/mapbox-gl-draw-split-polygon-mode)
-   [Cut Polygon Mode](https://github.com/ReyhaneMasumi/mapbox-gl-draw-cut-polygon-mode)
-   [Scale/Rotate Mode](https://github.com/ReyhaneMasumi/mapbox-gl-draw-scale-rotate-mode)
-   [Pinning Mode](https://github.com/mhsattarian/mapbox-gl-draw-pinning-mode)
-   [Snap Mode](https://github.com/mhsattarian/mapbox-gl-draw-snap-mode)
-   [Free Hand Mode](https://github.com/bemky/mapbox-gl-draw-freehand-mode)
-   [Rectangle Restrict Area Mode](https://github.com/dqunbp/mapbox-gl-draw-rectangle-restrict-area)
-   [Assisted Rectangle Mode](https://github.com/geostarters/mapbox-gl-draw-assisted-rectangle-mode)
-   [Circle](https://github.com/smithmicro/mapbox-gl-circle)
-   [Aditional Tools](https://github.com/ReyhaneMasumi/mapbox-gl-draw-additional-tools)

## [DEMO](https://map-ir.github.io/mapbox-gl-draw-geospatial-tools/)

![An Image showing toolbar](demo/public/demo.png)

[Or, See Example](https://github.com/map-ir/mapbox-gl-draw-geospatial-tools/blob/main/demo/src/App.js)

## Install

```bash
npm install @map.ir/mapbox-gl-draw-geospatial-tools
```

or use CDN:

```html
<script src="https://unpkg.com/@map.ir/mapbox-gl-draw-geospatial-tools"></script>
```

## Usage

**geospatial-tools** provides `MapboxDrawPro` class, a wrapper for `Mapbox Draw` so you can use it just like you would use `Mapbox Draw`.

```js
import mapboxGl from 'mapbox-gl';
import MapboxDrawPro from '@map.ir/mapbox-gl-draw-geospatial-tools';

const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-91.874, 42.76], // starting position
    zoom: 12, // starting zoom
});

const draw = new MapboxDrawPro(option);
```

> **`MapboxDrawPro` supported all options and methods of [MapboxGL-Draw](https://github.com/mapbox/mapbox-gl-draw)**
>
> See [API.md](https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/API.md) for complete reference.

also, you can customize options of internally used plugins which are as below in default:

```js
{
    userProperties: true,
    // aditional-tools
    union: true,
    copy: true,
    buffer: true,
    bufferSize: 0.5,
    bufferUnit: 'kilometers',
    bufferSteps: 64,
    length: true,
    lengthUnit: 'kilometers',
    showLength: true,
    area: true,
    showArea: true,

    // snap-mode
    snap: true,
    snapOptions: {
        snapPx: 15,
        snapToMidPoints: true,
    },
    guides: false,
}
```

## License

MIT © [map-ir](LICENSE)
