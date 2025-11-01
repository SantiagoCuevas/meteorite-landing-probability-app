import { describe, expect, it } from "vitest";
import { getData } from "../data";

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
});
