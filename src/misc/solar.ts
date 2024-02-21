import { GeoTiff } from "geo-env-typing/solar";
import * as geotiff from "geotiff";
import geokeysToProj4 from "geotiff-geokeys-to-proj4";
import proj4 from "proj4";

export function renderRGB(rgb: GeoTiff, mask?: GeoTiff) {
    // https://www.w3schools.com/tags/canvasElement_createimagedata.asp
    const canvasElement: HTMLCanvasElement = document.createElement("canvas");
    canvasElement.width = mask ? mask.width : rgb.width;
    canvasElement.height = mask ? mask.height : rgb.height;

    const renderingContext: CanvasRenderingContext2D = canvasElement.getContext("2d")!;
    const image = renderingContext.getImageData(0, 0, canvasElement.width, canvasElement.height);
    const dw = rgb.width / canvasElement.width;
    const dh = rgb.height / canvasElement.height;

    for (let y = 0; y < canvasElement.height; y++) {
        for (let x = 0; x < canvasElement.width; x++) {
            const imgIdx = y * canvasElement.width * 4 + x * 4;
            const rgbIdx = Math.floor(y * dh) * rgb.width + Math.floor(x * dw);
            const maskIdx = y * canvasElement.width + x;
            image.data[imgIdx + 0] = rgb.rasters[0][rgbIdx]; // Red
            image.data[imgIdx + 1] = rgb.rasters[1][rgbIdx]; // Green
            image.data[imgIdx + 2] = rgb.rasters[2][rgbIdx]; // Blue
            image.data[imgIdx + 3] = mask // Alpha
                ? mask.rasters[0][maskIdx] * 255
                : 255;
        }
    }

    renderingContext.putImageData(image, 0, 0);

    return canvasElement;
}

export function renderPalette({
    data,
    mask,
    colors,
    min,
    max,
    index
}: {
    data: GeoTiff;
    mask?: GeoTiff;
    colors?: string[];
    min?: number;
    max?: number;
    index?: number;
}) {
    const n = 256;
    const palette = createPalette(colors ?? ["000000", "ffffff"], n);
    const indices = data.rasters[index ?? 0]
        .map((x) => normalize(x, max ?? 1, min ?? 0))
        .map((x) => Math.round(x * (n - 1)));
    return renderRGB(
        {
            ...data,
            rasters: [
                indices.map((i: number) => palette[i].r),
                indices.map((i: number) => palette[i].g),
                indices.map((i: number) => palette[i].b)
            ]
        },
        mask
    );
}

export function createPalette(hexColors: string[], size: number) {
    const rgb = hexColors.map(colorToRGB);
    const step = (rgb.length - 1) / (size - 1);
    return Array(size)
        .fill(0)
        .map((_, i) => {
            const index = i * step;
            const j = Math.floor(index);
            const k = Math.ceil(index);
            return {
                r: lerp(rgb[j].r, rgb[k].r, index - j),
                g: lerp(rgb[j].g, rgb[k].g, index - j),
                b: lerp(rgb[j].b, rgb[k].b, index - j)
            };
        });
}

export function colorToRGB(color: string): { r: number; g: number; b: number } {
    const hex = color.startsWith("#") ? color.slice(1) : color;
    return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16)
    };
}

export function rgbToColor({ r, g, b }: { r: number; g: number; b: number }): string {
    const f = (x: number) => {
        const hex = Math.round(x).toString(16);
        return hex.length == 1 ? `0${hex}` : hex;
    };
    return `#${f(r)}${f(g)}${f(b)}`;
}

export function lerp(x: number, y: number, t: number) {
    return x + t * (y - x);
}

export function normalize(x: number, max: number = 1, min: number = 0) {
    const y = (x - min) / (max - min);
    return clamp(y, 0, 1);
}

export function clamp(x: number, min: number, max: number) {
    return Math.min(Math.max(x, min), max);
}

export async function makeGeotiff(data: any) {
    const buffer: Buffer = data.data;
    const arraybuffer: ArrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

    const tiff = await geotiff.fromArrayBuffer(arraybuffer);
    const image = await tiff.getImage();
    const rasters = await image.readRasters();

    const geoKeys = image.getGeoKeys();

    const projectionParameters = geokeysToProj4.toProj4(geoKeys);
    const projection = proj4(projectionParameters.proj4, "WGS84");
    const box = image.getBoundingBox();
    const swCoords = projection.forward({
        x: box[0] * projectionParameters.coordinatesConversionParameters.x,
        y: box[1] * projectionParameters.coordinatesConversionParameters.y
    });
    const neCoords = projection.forward({
        x: box[2] * projectionParameters.coordinatesConversionParameters.x,
        y: box[3] * projectionParameters.coordinatesConversionParameters.y
    });

    return {
        width: rasters.width,
        height: rasters.height,
        rasters: [...Array(rasters.length).keys()].map((i) => Array.from(rasters[i] as geotiff.TypedArray)),
        bounds: {
            north: neCoords.y,
            south: swCoords.y,
            east: neCoords.x,
            west: swCoords.x
        }
    } as GeoTiff;
}
