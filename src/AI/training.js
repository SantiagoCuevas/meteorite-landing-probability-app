// src/utils/training.js
import * as tf from "@tensorflow/tfjs";

const normLatitude = (latTile) => latTile / 90;
const normLongitude = (lonTile) => lonTile / 180;

export function makeTrainingTensors(tileArray) {
  const rows = tileArray.filter((t) => Number.isFinite(t.rate));
  const xsArr = rows.map((t) => [
    normLatitude(t.latTile),
    normLongitude(t.lonTile),
  ]);
  const ysArr = rows.map((t) => [t.rate]);

  const xs = tf.tensor2d(xsArr);
  const ys = tf.tensor2d(ysArr);
  return { xs, ys, count: rows.length };
}
