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
    return true;
  });
  return cleanData;
};
