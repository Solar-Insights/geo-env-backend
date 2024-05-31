import { GeoTiff } from "geo-env-typing/solar";
import * as geotiff from "geotiff";
import geokeysToProj4 from "geotiff-geokeys-to-proj4";
import proj4 from "proj4";

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
