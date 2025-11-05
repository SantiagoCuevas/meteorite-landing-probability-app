import csv from "./meteorite-landings.csv";

export const getData = () => {
  return csv;
};

export const cleanUpData = (data) => {
  const cleanData = data
    .map((item) => {
      const id = parseInt(item.id);
      const mass = parseInt(item.mass);
      const reclat = parseFloat(item.reclat);
      const reclong = parseFloat(item.reclong);
      const year = parseInt(item.year, 10);

      return { ...item, id, mass, reclat, reclong, year };
    })

    .filter((item) => {
      if (item.year >= 2016) {
        console.log("This");
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
