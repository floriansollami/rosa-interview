import { Interval as LInterval } from 'luxon';
import { DateTime } from './date-time';

export class Interval {
  private constructor(private readonly interval: LInterval) {}

  get start(): DateTime {
    return DateTime.parseFromLDateTime(this.interval.start!);
  }

  get end(): DateTime {
    return DateTime.parseFromLDateTime(this.interval.end!);
  }

  static parseFromJSDate(start: Date, end: Date): Interval {
    const interval = LInterval.fromDateTimes(start, end);

    if (!interval.isValid) {
      throw new Error(interval.invalidExplanation ?? 'invalid interval');
    }

    return new Interval(interval);
  }

  static parse(start: DateTime, end: DateTime): Interval {
    return Interval.parseFromJSDate(start.toJSDate(), end.toJSDate());
  }

  lengthInDays(): number {
    return this.interval.length('days');
  }

  isValid(): boolean {
    return this.interval.isValid;
  }

  overlaps(interval: Interval): boolean {
    return this.interval.overlaps(interval.interval);
  }

  difference(interval: Interval): Interval[] {
    return this.interval
      .difference(interval.interval)
      .map((interval) => new Interval(interval));
  }
}
