import csv from "./meteorite-landings.csv";

export const getData = () => {
  return csv;
};

export const cleanUpData = (data) => {
  const cleanData = data
    .map((item) => {
      const id = parseInt(item.id, 10);
      let mass = parseInt(item.mass, 10) || 0;
      const reclat = parseFloat(item.reclat);
      const reclong = parseFloat(item.reclong);
      const year = parseInt(item.year, 10);

      return { ...item, id, mass, reclat, reclong, year };
    })

    .filter((item) => {
      if (item.year >= 2016) {
        return false;
      }
      if (item.year <= 860) {
        return false;
      }
      if (item.reclat === 0 || item.reclong === 0) {
        return false;
      }
      if (item.reclat === 0.0 || item.reclong === 0.0) {
        return false;
      }
      if (item.reclong > 180 || item.reclong < -180) {
        return false;
      }
      return true;
    });
  return cleanData;
};

export const formatPieChartData = (cleanedData) => {
  const classifications = {};

  cleanedData.forEach((item) => {
    const key = item.recclass?.trim();
    if (!key) return;

    classifications[key] = (classifications[key] || 0) + 1;
  });

  const array = Object.entries(classifications)
    .map(([recclass, count]) => ({ recclass, count }))
    .sort((a, b) => b.count - a.count);

  return array.slice(0, 10);
};
