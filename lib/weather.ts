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

export function celsToFahr(cels: number): number {
  return Math.round((cels * 9 / 5) + 32);
}

export function kmPerHourToMPerSecond(speed: number): number {
  return Math.round(speed / 3.6);
}

export function kmPerHourToMilesPerHour(speed: number): number {
  return Math.round(speed * 0.6214);
}