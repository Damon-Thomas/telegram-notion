export function capitalizeFirst(str: string | undefined): string {
  if (!str) {
    console.warn("capitalizeFirst: Received undefined or empty string");
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
