import getAfterDate from "../getAfterDate";

test("getAfterDate returns today's date for null input", () => {
  const today = new Date();
  const result = getAfterDate(null);
  expect(result.getFullYear()).toBe(today.getFullYear());
  expect(result.getMonth()).toBe(today.getMonth());
  expect(result.getDate()).toBe(today.getDate());
  expect(result.getHours()).toBe(0);
  expect(result.getMinutes()).toBe(0);
  expect(result.getSeconds()).toBe(0);
});

test("getAfterDate returns start of day for input 'day'", () => {
  const today = new Date();
  const result = getAfterDate("day");
  expect(result.getFullYear()).toBe(today.getFullYear());
  expect(result.getMonth()).toBe(today.getMonth());
  expect(result.getDate()).toBe(today.getDate());
  expect(result.getHours()).toBe(0);
  expect(result.getMinutes()).toBe(0);
  expect(result.getSeconds()).toBe(0);
});

test("getAfterDate returns start of week for input 'week'", () => {
  const today = new Date();
  const result = getAfterDate("week");
  const firstDayOfWeek = new Date(
    today.setDate(today.getDate() - today.getDay())
  );
  expect(result.getFullYear()).toBe(firstDayOfWeek.getFullYear());
  expect(result.getMonth()).toBe(firstDayOfWeek.getMonth());
  expect(result.getDate()).toBe(firstDayOfWeek.getDate());
  expect(result.getHours()).toBe(0);
  expect(result.getMinutes()).toBe(0);
  expect(result.getSeconds()).toBe(0);
});

test("getAfterDate returns start of month for input 'month'", () => {
  const today = new Date();
  const result = getAfterDate("month");
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  expect(result.getFullYear()).toBe(firstDayOfMonth.getFullYear());
  expect(result.getMonth()).toBe(firstDayOfMonth.getMonth());
  expect(result.getDate()).toBe(firstDayOfMonth.getDate());
  expect(result.getHours()).toBe(0);
  expect(result.getMinutes()).toBe(0);
  expect(result.getSeconds()).toBe(0);
});

test("getAfterDate returns today's date for invalid input", () => {
  const today = new Date();
  const result = getAfterDate("invalid");
  expect(result.getFullYear()).toBe(today.getFullYear());
  expect(result.getMonth()).toBe(today.getMonth());
  expect(result.getDate()).toBe(today.getDate());
  expect(result.getHours()).toBe(0);
  expect(result.getMinutes()).toBe(0);
  expect(result.getSeconds()).toBe(0);
});

test("getAfterDate uses currentDate if provided", () => {
  const customDate = new Date(2023, 0, 1); // January 1, 2023
  const result = getAfterDate("day", customDate);
  expect(result.getFullYear()).toBe(customDate.getFullYear());
  expect(result.getMonth()).toBe(customDate.getMonth());
  expect(result.getDate()).toBe(customDate.getDate());
  expect(result.getHours()).toBe(0);
  expect(result.getMinutes()).toBe(0);
  expect(result.getSeconds()).toBe(0);
});

test("getAfterDate returns start of day for custom date with 'day'", () => {
  const customDate = new Date(2023, 0, 1); // January 1, 2023
  const result = getAfterDate("day", customDate);
  expect(result.getFullYear()).toBe(customDate.getFullYear());
  expect(result.getMonth()).toBe(customDate.getMonth());
  expect(result.getDate()).toBe(customDate.getDate());
  expect(result.getHours()).toBe(0);
  expect(result.getMinutes()).toBe(0);
  expect(result.getSeconds()).toBe(0);
});

test("getAfterDate returns start of week for custom date with 'week'", () => {
  const customDate = new Date(2023, 0, 1); // January 1, 2023
  const result = getAfterDate("week", customDate);
  const firstDayOfWeek = new Date(
    customDate.setDate(customDate.getDate() - customDate.getDay())
  );
  expect(result.getFullYear()).toBe(firstDayOfWeek.getFullYear());
  expect(result.getMonth()).toBe(firstDayOfWeek.getMonth());
  expect(result.getDate()).toBe(firstDayOfWeek.getDate());
  expect(result.getHours()).toBe(0);
  expect(result.getMinutes()).toBe(0);
  expect(result.getSeconds()).toBe(0);
});

test("getAfterDate returns start of month for custom date with 'month'", () => {
  const customDate = new Date(2023, 0, 15); // January 15, 2023
  const result = getAfterDate("month", customDate);
  const firstDayOfMonth = new Date(
    customDate.getFullYear(),
    customDate.getMonth(),
    1
  );
  expect(result.getFullYear()).toBe(firstDayOfMonth.getFullYear());
  expect(result.getMonth()).toBe(firstDayOfMonth.getMonth());
  expect(result.getDate()).toBe(firstDayOfMonth.getDate());
  expect(result.getHours()).toBe(0);
  expect(result.getMinutes()).toBe(0);
  expect(result.getSeconds()).toBe(0);
});

test("getAfterDate returns today's date for custom date with invalid input", () => {
  const customDate = new Date(2023, 0, 1); // January 1, 2023
  const result = getAfterDate("invalid", customDate);
  expect(result.getFullYear()).toBe(customDate.getFullYear());
  expect(result.getMonth()).toBe(customDate.getMonth());
  expect(result.getDate()).toBe(customDate.getDate());
  expect(result.getHours()).toBe(0);
  expect(result.getMinutes()).toBe(0);
  expect(result.getSeconds()).toBe(0);
});

test("getAfterDate returns correct date for end of month", () => {
  const customDate = new Date(2023, 1, 28); // February 28, 2023
  const result = getAfterDate("month", customDate);
  const firstDayOfMonth = new Date(
    customDate.getFullYear(),
    customDate.getMonth(),
    1
  );
  expect(result.getFullYear()).toBe(firstDayOfMonth.getFullYear());
  expect(result.getMonth()).toBe(firstDayOfMonth.getMonth());
  expect(result.getDate()).toBe(firstDayOfMonth.getDate());
  expect(result.getHours()).toBe(0);
  expect(result.getMinutes()).toBe(0);
  expect(result.getSeconds()).toBe(0);
});

test("getAfterDate handles edge case of month with 31 days", () => {
  const customDate = new Date(2023, 3, 30); // April 30, 2023
  const result = getAfterDate("month", customDate);
  const firstDayOfMonth = new Date(
    customDate.getFullYear(),
    customDate.getMonth(),
    1
  );
  expect(result.getFullYear()).toBe(firstDayOfMonth.getFullYear());
  expect(result.getMonth()).toBe(firstDayOfMonth.getMonth());
  expect(result.getDate()).toBe(firstDayOfMonth.getDate());
  expect(result.getHours()).toBe(0);
  expect(result.getMinutes()).toBe(0);
  expect(result.getSeconds()).toBe(0);
});

test("getAfterDate handles edge case of month with 30 days", () => {
  const customDate = new Date(2023, 8, 30); // September 30, 2023
  const result = getAfterDate("month", customDate);
  const firstDayOfMonth = new Date(
    customDate.getFullYear(),
    customDate.getMonth(),
    1
  );
  expect(result.getFullYear()).toBe(firstDayOfMonth.getFullYear());
  expect(result.getMonth()).toBe(firstDayOfMonth.getMonth());
  expect(result.getDate()).toBe(firstDayOfMonth.getDate());
  expect(result.getHours()).toBe(0);
  expect(result.getMinutes()).toBe(0);
  expect(result.getSeconds()).toBe(0);
});

test("getAfterDate handles edge case of month with February 29 in a non-leap year", () => {
  const customDate = new Date(2021, 1, 29); // February 29, 2021 (not a leap year)
  const result = getAfterDate("month", customDate);
  const firstDayOfMonth = new Date(
    customDate.getFullYear(),
    customDate.getMonth(),
    1
  );
  expect(result.getFullYear()).toBe(firstDayOfMonth.getFullYear());
  expect(result.getMonth()).toBe(firstDayOfMonth.getMonth());
  expect(result.getDate()).toBe(firstDayOfMonth.getDate());
  expect(result.getHours()).toBe(0);
  expect(result.getMinutes()).toBe(0);
  expect(result.getSeconds()).toBe(0);
});

test("getAfterDate handles edge case of month with February 28 in a leap year", () => {
  const customDate = new Date(2020, 1, 28); // February 28, 2020 (leap year)
  const result = getAfterDate("month", customDate);
  const firstDayOfMonth = new Date(
    customDate.getFullYear(),
    customDate.getMonth(),
    1
  );
  expect(result.getFullYear()).toBe(firstDayOfMonth.getFullYear());
  expect(result.getMonth()).toBe(firstDayOfMonth.getMonth());
  expect(result.getDate()).toBe(firstDayOfMonth.getDate());
  expect(result.getHours()).toBe(0);
  expect(result.getMinutes()).toBe(0);
  expect(result.getSeconds()).toBe(0);
});

test("getAfterDate returns correct year for leap year February 29", () => {
  const customDate = new Date(2020, 1, 29); // February 29, 2020
  const result = getAfterDate("month", customDate);
  const firstDayOfMonth = new Date(
    customDate.getFullYear(),
    customDate.getMonth(),
    1
  );
  expect(result.getFullYear()).toBe(firstDayOfMonth.getFullYear());
  expect(result.getMonth()).toBe(firstDayOfMonth.getMonth());
  expect(result.getDate()).toBe(firstDayOfMonth.getDate());
  expect(result.getHours()).toBe(0);
  expect(result.getMinutes()).toBe(0);
  expect(result.getSeconds()).toBe(0);
});

test("getAfterDate handles edge case of month with February 30", () => {
  const customDate = new Date(2023, 1, 30); // February 30, 2023 (invalid date)
  const result = getAfterDate("month", customDate);
  const firstDayOfMonth = new Date(
    customDate.getFullYear(),
    customDate.getMonth(),
    1
  );
  expect(result.getFullYear()).toBe(firstDayOfMonth.getFullYear());
  expect(result.getMonth()).toBe(firstDayOfMonth.getMonth());
  expect(result.getDate()).toBe(firstDayOfMonth.getDate());
  expect(result.getHours()).toBe(0);
  expect(result.getMinutes()).toBe(0);
  expect(result.getSeconds()).toBe(0);
});

test("getAfterDate handles edge case of first day of year", () => {
  const customDate = new Date(2023, 0, 1); // January 1, 2023
  const result = getAfterDate("month", customDate);
  const firstDayOfMonth = new Date(
    customDate.getFullYear(),
    customDate.getMonth(),
    1
  );
  expect(result.getFullYear()).toBe(firstDayOfMonth.getFullYear());
  expect(result.getMonth()).toBe(firstDayOfMonth.getMonth());
  expect(result.getDate()).toBe(firstDayOfMonth.getDate());
  expect(result.getHours()).toBe(0);
  expect(result.getMinutes()).toBe(0);
  expect(result.getSeconds()).toBe(0);
});
