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
      if (!Number.isFinite(item.reclat) || !Number.isFinite(item.reclong)) {
        return false;
      }
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

export const formatLineTrendChart = (cleanedData) => {
  const bins = [
    [840, 900],
    [900, 1000],
    [1000, 1100],
    [1100, 1200],
    [1200, 1300],
    [1300, 1400],
    [1400, 1500],
    [1500, 1600],
    [1600, 1700],
    [1700, 1800],
    [1800, 1900],
    [1900, 2000],
    [2000, 2016],
  ];

  const counts = bins.map(([start, end]) => ({
    range: `${start}-${end}`,
    count: 0,
  }));

  cleanedData.forEach((item) => {
    const year = item.year;
    if (!Number.isFinite(year)) return;

    for (let i = 0; i < bins.length; i++) {
      const [start, end] = bins[i];
      if (year >= start && year < end) {
        counts[i].count += 1;
        break;
      }
    }
  });

  return counts;
};
