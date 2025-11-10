import * as tf from "@tensorflow/tfjs";

const normLatitude = (latTile) => latTile / 90;
const normLongitude = (lonTile) => lonTile / 180;

export const getBackendInfo = async () => {
  await tf.ready();
  const backend = tf.getBackend();
  const isWebGL = backend === 'webgl';

  let gpuInfo = null;
  if (isWebGL) {
    const gl = document.createElement('canvas').getContext('webgl2') ||
               document.createElement('canvas').getContext('webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      gpuInfo = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'WebGL Available';
    }
  }

  return {
    backend,
    isWebGL,
    gpuInfo,
    numTensors: tf.memory().numTensors,
  };
};

export const ensureWebGLBackend = async () => {
  await tf.ready();
  await tf.setBackend('webgl');
  await tf.ready();

  // Enable WebGL optimization flags for better performance
  tf.env().set('WEBGL_FORCE_F16_TEXTURES', true);
  tf.env().set('WEBGL_PACK', true);
  tf.env().set('WEBGL_EXP_CONV', true);
  tf.env().set('WEBGL_CPU_FORWARD', false);

  return tf.getBackend();
};

export const makeTrainingTensors = (tileArray) => {
  const rows = tileArray.filter((t) => Number.isFinite(t.rate));
  const xsArr = rows.map((t) => [
    normLatitude(t.latTile),
    normLongitude(t.lonTile),
  ]);
  const ysArr = rows.map((t) => [t.rate]);

  const xs = tf.tensor2d(xsArr);
  const ys = tf.tensor2d(ysArr);
  return { xs, ys, count: rows.length };
};

export const buildModel = () => {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({ units: 16, activation: "relu", inputShape: [2] })
  );
  model.add(tf.layers.dense({ units: 16, activation: "relu" }));
  model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));
  model.compile({ optimizer: tf.train.adam(0.01), loss: "meanSquaredError" });
  return model;
};

export const trainModel = async (model, xs, ys, onProgress = null) => {
  const N = xs.shape[0];
  const idx = tf.util.createShuffledIndices(N);
  const split = Math.floor(N * 0.8);

  const trainIdxTensor = tf.tensor1d(Array.from(idx.slice(0, split)), "int32");
  const valIdxTensor = tf.tensor1d(Array.from(idx.slice(split)), "int32");

  const xTrain = tf.gather(xs, trainIdxTensor);
  const yTrain = tf.gather(ys, trainIdxTensor);
  const xVal = tf.gather(xs, valIdxTensor);
  const yVal = tf.gather(ys, valIdxTensor);

  const callbacks = onProgress ? {
    onEpochEnd: async (epoch, logs) => {
      onProgress({
        epoch: epoch + 1,
        loss: logs.loss,
        valLoss: logs.val_loss,
      });
    }
  } : {};

  // Optimize batch size based on data size for better GPU utilization
  // Larger batches = more GPU parallelism = faster training
  const optimalBatchSize = Math.min(512, Math.floor(N * 0.2));

  const history = await model.fit(xTrain, yTrain, {
    epochs: 100,
    batchSize: optimalBatchSize,
    validationData: [xVal, yVal],
    shuffle: true, // Enable shuffling for better training
    verbose: 0,
    callbacks,
    // Use all available GPU memory
    batchesPerEpoch: null, // Process all data
  });

  xTrain.dispose();
  yTrain.dispose();
  xVal.dispose();
  yVal.dispose();
  trainIdxTensor.dispose();
  valIdxTensor.dispose();

  return history;
};

export const saveModel = async (model) => {
  await model.save("localstorage://meteorite-rate-model");
};

export const loadModelIfAny = async () => {
  try {
    const loaded = await tf.loadLayersModel(
      "localstorage://meteorite-rate-model"
    );
    loaded.compile({
      optimizer: tf.train.adam(0.01),
      loss: "meanSquaredError",
    });
    return loaded;
  } catch {
    return null;
  }
};

export const predictRate = (model, latTile, lonTile) => {
  const x = tf.tensor2d([[normLatitude(latTile), normLongitude(lonTile)]]);
  const y = model.predict(x);
  const rate = y.dataSync()[0];
  x.dispose();
  y.dispose();
  return rate;
};
