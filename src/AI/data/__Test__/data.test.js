import { describe, expect, it } from "vitest";
import { cleanUpData, getData } from "../data";

describe("AI data functions", () => {
  describe("getData", () => {
    it("Returns an Array", () => {
      const result = getData();
      expect(Array.isArray(result)).toBeTruthy();
    });
    it("Returns the expected array length", () => {
      const result = getData();
      expect(result.length).toEqual(45716);
    });
  });

  describe("cleanData", () => {
    it("Returns an array", () => {
      const data = getData();
      const result = data;
      expect(Array.isArray(result)).toBeTruthy();
    });
    it("Removes data with year 2016 or later", () => {
      const data = getData();
      const result = cleanUpData(data);
      expect(result.some((item) => parseInt(item.year, 10) >= 2016)).toEqual(
        false
      );
    });
    it("Removes data with year 860 or earlier", () => {
      const data = getData();
      const result = cleanUpData(data);
      expect(result.some((item) => parseInt(item.year, 10) <= 860)).toEqual(
        false
      );
    });
    it("Removes data with empty lat long values", () => {
      const data = getData();
      const result = cleanUpData(data);
      expect(
        result.some((item) => item.reclat === "" || item.reclong === "")
      ).toEqual(false);
    });
    it("Removes data with lat long values 0, 0", () => {
      const data = getData();
      const result = cleanUpData(data);
      expect(
        result.some(
          (item) => item.reclat === "0.000000" && item.reclong === "0.000000"
        )
      ).toEqual(false);
    });
    it("Removes data with long values above 180 and below -180", () => {
      const data = getData();
      const result = cleanUpData(data);
      expect(
        result.some((item) => {
          const longitude = parseFloat(item.reclong);
          if (longitude > 180) {
            return true;
          }

          if (longitude < -180) {
            return true;
          }

          return false;
        })
      ).toEqual(false);
    });
  });
});
