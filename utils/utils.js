export function validateNumber(input) {
  // Matches only numbers
  if (typeof input !== "string" || !/^\d+$/.test(input)) {
    return null;
  }

  // Converts input to an integer and returns
  return parseInt(input, 10);
}
