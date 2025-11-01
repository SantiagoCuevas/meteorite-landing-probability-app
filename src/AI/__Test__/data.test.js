import { describe, expect, it } from "vitest";
import { getData } from "../data";

describe("AI data functions", () => {
  describe("getData", () => {
    it("Returns an Array", () => {
      const result = getData();
      expect(Array.isArray(result)).toBeTruthy();
    });
  });
});
