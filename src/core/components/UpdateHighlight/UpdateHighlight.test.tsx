import React from "react";
import { render } from "@testing-library/react";
import UpdateHighlight, { calculateParts } from "./UpdateHighlight";

describe("UpdateHighlight", () => {
  describe("calculateParts()", () => {
    it("should return empty", () => {
      expect(calculateParts("", "")).toEqual(["", ""]);
    });

    it("should return the changed part", () => {
      expect(calculateParts("10.34", "10.33")).toEqual(["10.3", "4"]);
      "";
    });
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  it(`should highlight the changed part`, () => {
    let result = render(<UpdateHighlight value="1.234" />);
    expect(result.queryAllByText("1.234", { exact: true })).toHaveLength(1);
    result.rerender(<UpdateHighlight value="1.235" />);
    expect(result.queryAllByText("1.23", { exact: true })).toHaveLength(1);
    expect(result.queryAllByText("5", { exact: true })).toHaveLength(1);
  });
});
