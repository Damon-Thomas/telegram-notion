import { capitalizeFirst } from "../capitalizeFirst";

test("capitalizeFirst all lower", () => {
  expect(capitalizeFirst("hello world")).toBe("Hello world");
});

test("capitalizeFirst mixed case", () => {
  expect(capitalizeFirst("hElLo WoRlD")).toBe("Hello world");
});

test("capitalizeFirst empty string", () => {
  expect(capitalizeFirst("")).toBe("");
});

test("capitalizeFirst undefined", () => {
  expect(capitalizeFirst(undefined)).toBe("");
});

test("capitalizeFirst single character", () => {
  expect(capitalizeFirst("a")).toBe("A");
});

test("capitalizeFirst single character uppercase", () => {
  expect(capitalizeFirst("A")).toBe("A");
});

test("capitalizeFirst with punctuation", () => {
  expect(capitalizeFirst("hello, world!")).toBe("Hello, world!");
});

test("capitalizeFirst with numbers", () => {
  expect(capitalizeFirst("123abc")).toBe("123abc");
});

test("capitalizeFirst with special characters", () => {
  expect(capitalizeFirst("@hello world")).toBe("@hello world");
});

test("capitalizeFirst with leading spaces", () => {
  expect(capitalizeFirst("  hello world")).toBe("Hello world");
});

test("capitalizeFirst with trailing spaces", () => {
  expect(capitalizeFirst("hello world  ")).toBe("Hello world");
});

test("capitalizeFirst with mixed spaces", () => {
  expect(capitalizeFirst("  hello   world  ")).toBe("Hello   world");
});
