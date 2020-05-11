import { getValueAt } from "./utils";

describe("Utils", () => {
  describe("getValueAt()", () => {
    it("should handle any index", () => {
      const values = ["a", "b", "c"];
      expect(getValueAt(values)(0)).toBe("a");
      expect(getValueAt(values)(3)).toBe("a");
      expect(getValueAt(values)(7)).toBe("b");
      expect(getValueAt(values)(-1)).toBe("c");
      expect(getValueAt(values)(-4)).toBe("c");
    });
  });
});
