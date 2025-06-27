export function capitalizeFirst(str: string | undefined): string {
  if (!str) {
    console.warn("capitalizeFirst: Received undefined or empty string");
    return "";
  }
  if (typeof str !== "string") {
    console.warn("capitalizeFirst: Expected a string, received:", str);
    return "";
  }
  let trimmedStr = str.trim();
  if (trimmedStr.length === 0) {
    return "";
  }
  return trimmedStr.charAt(0).toUpperCase() + trimmedStr.slice(1).toLowerCase();
}
