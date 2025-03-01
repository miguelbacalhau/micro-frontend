import { describe, expect, it } from "vitest";

import { validateRegister } from "../../src/server/validation.js";

describe("validateRegister", () => {
  it("should validate and return the data when name and assets.js are strings and assets.css is a string", () => {
    const data = { name: "test", assets: { js: "main.js", css: "styles.css" } };
    expect(validateRegister(data)).toEqual(data);
  });

  it("should validate and return the data when name and assets.js are strings and assets.css is undefined", () => {
    const data = { name: "test", assets: { js: "main.js" } };
    expect(validateRegister(data)).toEqual(data);
  });

  it("should throw an error when name is not a string", () => {
    const data = { name: 123, assets: { js: "main.js", css: "styles.css" } };
    expect(() => validateRegister(data)).toThrow("Invalid data");
  });

  it("should throw an error when assets.js is not a string", () => {
    const data = { name: "test", assets: { js: 123, css: "styles.css" } };
    expect(() => validateRegister(data)).toThrow("Invalid data");
  });

  it("should throw an error when assets.css is not a string or undefined", () => {
    const data1 = { name: "test", assets: { js: "main.js", css: 123 } };
    const data2 = { name: "test", assets: { js: "main.js", css: null } };
    expect(() => validateRegister(data1)).toThrow("Invalid data");
    expect(() => validateRegister(data2)).toThrow("Invalid data");
  });

  it("should throw an error when assets is missing", () => {
    const data = { name: "test" };
    expect(() => validateRegister(data)).toThrow("Invalid data");
  });
});
