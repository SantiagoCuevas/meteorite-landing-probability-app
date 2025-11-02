import csv from "./meteorite-landings.csv";

export const getData = () => {
  return csv;
};

export const cleanUpData = (data) => {
  const cleanData = data.filter((item) => {
    const parsed = parseInt(item.year);
    if (parsed >= 2016) {
      return false;
    }
    if (parsed <= 860) {
      return false;
    }
    if (item.reclat === "" || item.reclong === "") {
      return false;
    }
    return true;
  });
  return cleanData;
};
