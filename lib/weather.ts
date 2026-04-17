import {Day} from "@/app/actions/types";

export async function calcAverageTemp(days: Day[]): Promise<number> {
  let sumTemp = 0;
  // todo: bad ((
  for (const day of days) {
    sumTemp += day.tempMax;
  }
  const daysCount = days.length;
  return Math.round(sumTemp / daysCount);
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
