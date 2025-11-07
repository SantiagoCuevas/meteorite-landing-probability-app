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

export function buildModel() {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({ units: 16, activation: "relu", inputShape: [2] })
  );
  model.add(tf.layers.dense({ units: 16, activation: "relu" }));
  model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));
  model.compile({ optimizer: tf.train.adam(0.01), loss: "meanSquaredError" });
  return model;
}

export async function trainModel(model, xs, ys) {
  const N = xs.shape[0];
  const idx = tf.util.createShuffledIndices(N);
  const split = Math.floor(N * 0.8);
  const trainIdx = idx.slice(0, split);
  const valIdx = idx.slice(split);

  const xTrain = tf.gather(xs, trainIdx);
  const yTrain = tf.gather(ys, trainIdx);
  const xVal = tf.gather(xs, valIdx);
  const yVal = tf.gather(ys, valIdx);

  const history = await model.fit(xTrain, yTrain, {
    epochs: 100,
    batchSize: 64,
    validationData: [xVal, yVal],
    verbose: 0,
  });

  xTrain.dispose();
  yTrain.dispose();
  xVal.dispose();
  yVal.dispose();
  return history;
}
