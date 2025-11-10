import { useEffect, useMemo, useState } from "react";
import { cleanUpData, getData } from "../AI/data/data";
import {
  aggregateTiles,
  expandToFullTileGrid,
  latLongCoordToTile,
  normalizeCounts,
  tileKey,
} from "../utils/tiling";
import {
  buildModel,
  loadModelIfAny,
  makeTrainingTensors,
  predictRate,
  saveModel,
  trainModel,
} from "../AI/aiModel";

const formatLoss = (value) =>
  typeof value === "number" ? value.toExponential(3) : "—";

export function ModelTestComponent() {
  const rawData = getData();
  const cleanData = useMemo(() => cleanUpData(rawData), [rawData]);
  const tiles = useMemo(() => {
    const aggregated = aggregateTiles(cleanData);
    const fullGrid = expandToFullTileGrid(aggregated);
    return normalizeCounts(fullGrid);
  }, [cleanData]);

  const tileLookup = useMemo(() => {
    const store = new Map();
    tiles.forEach((tile) =>
      store.set(tileKey(tile.latTile, tile.lonTile), tile)
    );
    return store;
  }, [tiles]);

  const [model, setModel] = useState(null);
  const [status, setStatus] = useState("bootstrapping…");
  const [trainingSummary, setTrainingSummary] = useState(null);
  const [error, setError] = useState(null);
  const [predictionInput, setPredictionInput] = useState({ lat: 0, lon: 0 });
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setStatus("loading saved model…");
        const stored = await loadModelIfAny();
        if (!cancelled) {
          setModel(stored ?? buildModel());
          setStatus("ready");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message ?? String(err));
          setModel(buildModel());
          setStatus("ready");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleTrain = async () => {
    if (!tiles.length) return;
    setStatus("training");
    setError(null);
    const { xs, ys, count } = makeTrainingTensors(tiles);
    const activeModel = model ?? buildModel();

    try {
      const history = await trainModel(activeModel, xs, ys);
      await saveModel(activeModel);
      setModel(activeModel);
      setTrainingSummary({
        samples: count,
        epochs: history.epoch.length,
        loss: history.history.loss.at(-1),
        valLoss: history.history.val_loss.at(-1),
      });
    } catch (err) {
      setError(err.message ?? String(err));
    } finally {
      xs.dispose();
      ys.dispose();
      setStatus("ready");
    }
  };

  const handlePredict = () => {
    setError(null);
    if (!model) {
      setError("Load or train the model first.");
      return;
    }

    const lat = Number(predictionInput.lat);
    const lon = Number(predictionInput.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      setError("Latitude and longitude must be numeric.");
      return;
    }

    const { latTile, lonTile } = latLongCoordToTile(lat, lon);
    const rate = predictRate(model, latTile, lonTile);
    const observed = tileLookup.get(tileKey(latTile, lonTile));

    setPrediction({
      latTile,
      lonTile,
      rate,
      observedRate: observed?.rate ?? null,
      observedCount: observed?.count ?? 0,
    });
  };

  const populateFromSample = () => {
    if (!tiles.length) return;
    const sample = tiles[Math.floor(Math.random() * tiles.length)];
    setPredictionInput({
      lat: sample.latTile + 0.5,
      lon: sample.lonTile + 0.5,
    });
  };

  return (
    <section className="model-test-harness">
      <h2>TensorFlow Test</h2>
      <p>Status: {status}</p>
      {error && <p className="error">Error: {error}</p>}

      <div className="controls">
        <button onClick={handleTrain} disabled={status === "training"}>
          {status === "training" ? "Training…" : "Train / Retrain Model"}
        </button>
        <button onClick={populateFromSample} disabled={!tiles.length}>
          Use Random Tile Sample
        </button>
      </div>

      {trainingSummary && (
        <dl className="metrics">
          <dt>Samples</dt>
          <dd>{trainingSummary.samples}</dd>
          <dt>Epochs</dt>
          <dd>{trainingSummary.epochs}</dd>
          <dt>Final Loss</dt>
          <dd>{formatLoss(trainingSummary.loss)}</dd>
          <dt>Final Val Loss</dt>
          <dd>{formatLoss(trainingSummary.valLoss)}</dd>
        </dl>
      )}

      <div className="predict-form">
        <label>
          Latitude
          <input
            type="number"
            value={predictionInput.lat}
            onChange={(e) =>
              setPredictionInput((prev) => ({
                ...prev,
                lat: e.target.value,
              }))
            }
          />
        </label>
        <label>
          Longitude
          <input
            type="number"
            value={predictionInput.lon}
            onChange={(e) =>
              setPredictionInput((prev) => ({
                ...prev,
                lon: e.target.value,
              }))
            }
          />
        </label>
        <button onClick={handlePredict}>Predict Tile Rate</button>
      </div>

      {prediction && (
        <div className="prediction-output">
          <p>
            Tile: ({prediction.latTile}, {prediction.lonTile})
          </p>
          <p>Predicted probability: {prediction.rate.toFixed(4)}</p>
          {prediction.observedRate != null ? (
            <p>
              Observed rate: {prediction.observedRate.toFixed(4)} (
              {prediction.observedCount} landings)
            </p>
          ) : (
            <p>No historical data for this tile.</p>
          )}
        </div>
      )}
    </section>
  );
}
