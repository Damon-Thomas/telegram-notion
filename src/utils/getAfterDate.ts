export default function getAfterDate(
  date: string | null = null,
  currentDate?: Date
): Date {
  const today = currentDate || new Date();
  if (date === "day") {
    return new Date(today.setHours(0, 0, 0, 0));
  } else if (date === "week") {
    const firstDayOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    return new Date(firstDayOfWeek.setHours(0, 0, 0, 0));
  } else if (date === "month") {
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return new Date(firstDayOfMonth.setHours(0, 0, 0, 0));
  } else {
    return new Date(today.setHours(0, 0, 0, 0)); // Default to today if no valid date is provided
  }
}
