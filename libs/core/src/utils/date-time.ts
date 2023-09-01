import { DateTime as LDateTime } from 'luxon';

interface Duration {
  years?: number;
  months?: number;
  days?: number;
  milliseconds?: number;
}

interface TimeUnits {
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
}

export class DateTime {
  private readonly date: LDateTime;

  public constructor(date: LDateTime) {
    if (!date.isValid) {
      throw new Error(date.invalidExplanation ?? 'invalid date');
    }

    this.date = date;
  }

  static parse(date: string, timezone = 'UTC'): DateTime {
    return new this(LDateTime.fromISO(date, { zone: timezone }));
  }

  static parseFromLDateTime(date: LDateTime): DateTime {
    return new this(date.toUTC());
  }

  static parseFromJSDate(date: Date): DateTime {
    return new this(LDateTime.fromJSDate(date));
  }

  /**
   * Get the day of the week. 1 is Monday and 7 is Sunday (ISO week date)
   */
  getWeekDay(): number {
    return this.date.weekday;
  }

  getTimeUnits(): TimeUnits {
    const date = this.date;

    return {
      hour: date.hour,
      minute: date.minute,
      second: date.second,
      millisecond: date.millisecond,
    };
  }

  isBefore(date: DateTime): boolean {
    return this.date.diff(date.date, 'milliseconds').milliseconds < 0;
  }

  isSameOrBefore(date: DateTime): boolean {
    return this.date.diff(date.date, 'milliseconds').milliseconds <= 0;
  }

  plus(duration: Duration): DateTime {
    return new DateTime(this.date.plus(duration));
  }

  set(values: TimeUnits): DateTime {
    return new DateTime(this.date.set(values));
  }

  setTimeUnits(date: DateTime): DateTime {
    return new DateTime(this.date.set(date.getTimeUnits()));
  }

  toJSDate(): Date {
    return this.date.toJSDate();
  }

  toISO8601String(): string | null {
    return this.date.toUTC().toISO();
  }

  toTZ(timezone: string): DateTime {
    return new DateTime(this.date.setZone(timezone));
  }

  toFormat(format = "yyyy-MM-dd'T'HH:mm:ss"): string {
    return this.date.toFormat(format);
  }
}
