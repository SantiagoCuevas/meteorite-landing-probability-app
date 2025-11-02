import csv from "./meteorite-landings.csv";

export const getData = () => {
  return csv;
};

export const cleanUpData = (data) => {
  const cleanData = data.filter((item) => {
    const parsedYear = parseInt(item.year);
    const parsedLong = parseInt(item.reclong);

    if (parsedYear >= 2016) {
      return false;
    }
    if (parsedYear <= 860) {
      return false;
    }
    if (item.reclat === "" || item.reclong === "") {
      return false;
    }
    if (item.reclat === "0.000000" || item.reclong === "0.000000") {
      return false;
    }
    if (parsedLong > 180 || parsedLong < -180) {
      return false;
    }
    return true;
  });
  return cleanData;
};
