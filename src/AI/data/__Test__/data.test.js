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
  });
});
